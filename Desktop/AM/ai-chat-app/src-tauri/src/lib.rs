use serde::Serialize;
use std::fs;
use std::path::Path;
use tauri::Emitter;
use tauri_plugin_updater::UpdaterExt;

/* ── Shell output DTO ── */
#[derive(Serialize)]
struct ShellResult {
  stdout: String,
  stderr: String,
  code: i32,
}

#[derive(Serialize)]
struct DirEntry {
  name: String,
  is_dir: bool,
  size: u64,
}

/* ── Tauri commands ── */

#[tauri::command]
fn read_file(path: String) -> Result<String, String> {
  fs::read_to_string(&path).map_err(|e| e.to_string())
}

#[tauri::command]
fn write_file(path: String, contents: String) -> Result<(), String> {
  if let Some(parent) = Path::new(&path).parent() {
    fs::create_dir_all(parent).map_err(|e| e.to_string())?;
  }
  fs::write(&path, contents).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_dir(path: String) -> Result<Vec<DirEntry>, String> {
  let mut entries = Vec::new();
  for entry in fs::read_dir(&path).map_err(|e| e.to_string())? {
    let entry = entry.map_err(|e| e.to_string())?;
    let meta = entry.metadata().map_err(|e| e.to_string())?;
    entries.push(DirEntry {
      name: entry.file_name().to_string_lossy().to_string(),
      is_dir: meta.is_dir(),
      size: meta.len(),
    });
  }
  entries.sort_by(|a, b| a.name.to_lowercase().cmp(&b.name.to_lowercase()));
  Ok(entries)
}

#[tauri::command]
fn get_cwd() -> Result<String, String> {
  std::env::current_dir()
    .map(|p| p.to_string_lossy().to_string())
    .map_err(|e| e.to_string())
}

#[tauri::command]
async fn run_command(cmd: String, args: Vec<String>) -> Result<ShellResult, String> {
  use std::process::Stdio;
  let child = std::process::Command::new(&cmd)
    .args(&args)
    .stdout(Stdio::piped())
    .stderr(Stdio::piped())
    .spawn()
    .map_err(|e| e.to_string())?;

  let output = child
    .wait_with_output()
    .map_err(|e| e.to_string())?;

  Ok(ShellResult {
    stdout: String::from_utf8_lossy(&output.stdout).to_string(),
    stderr: String::from_utf8_lossy(&output.stderr).to_string(),
    code: output.status.code().unwrap_or(-1),
  })
}

#[tauri::command]
fn search_files(query: String, dir: String, ext: Option<String>) -> Result<Vec<String>, String> {
  let mut results = Vec::new();
  let ext_filter = ext.map(|e| {
    let e = e.to_lowercase();
    if e.starts_with('.') { e } else { format!(".{}", e) }
  });

  fn walk(path: &Path, query: &str, ext_filter: &Option<String>, results: &mut Vec<String>) {
    if let Ok(entries) = fs::read_dir(path) {
      for entry in entries.flatten() {
        let meta = match entry.metadata() {
          Ok(m) => m,
          Err(_) => continue,
        };
        let name = entry.file_name().to_string_lossy().to_string();
        if meta.is_dir() && !name.starts_with('.') {
          walk(&entry.path(), query, ext_filter, results);
        } else if meta.is_file() {
          if let Some(ref ext) = ext_filter {
            if !name.to_lowercase().ends_with(ext) { continue; }
          }
          if let Ok(content) = fs::read_to_string(&entry.path()) {
            if content.contains(query) {
              results.push(entry.path().to_string_lossy().to_string());
            }
          }
        }
      }
    }
  }

  walk(Path::new(&dir), &query, &ext_filter, &mut results);
  Ok(results)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_updater::Builder::new().build())
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_fs::init())
    .invoke_handler(tauri::generate_handler![
      read_file,
      write_file,
      list_dir,
      get_cwd,
      run_command,
      search_files,
    ])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      // Auto-check for updates on launch (non-blocking)
      let handle = app.handle().clone();
      tauri::async_runtime::spawn(async move {
        if let Ok(updater) = handle.updater_builder().build() {
          if let Ok(Some(update)) = updater.check().await {
            log::info!("Update {} available", update.version);
            let _ = handle.emit("update-available", serde_json::json!({
              "version": update.version,
              "notes": update.body,
              "date": update.date.map(|d| d.to_string()),
            }));
          }
        }
      });

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
