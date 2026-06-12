import type { IconName } from "./icons";

interface RawService {
  name: string;
  description: string;
  capabilities: string[];
  documentation: {
    overview: string;
    howItWorks: { step: number; title: string; description: string }[];
    benefits: { title: string; description: string; metric: string }[];
    useCases: { title: string; description: string }[];
  };
}

interface RawDepartment {
  department: string;
  icon: IconName;
  items: RawService[];
}

export const departments: RawDepartment[] = [
  {
    "department": "Front Office",
    "icon": "phone",
    "items": [
      {
        "name": "Receptionist",
        "description": "Answers calls, takes messages, and routes people to the right person — just like a front desk receptionist.",
        "capabilities": [
          "Answers incoming calls with a professional greeting",
          "Takes detailed messages and forwards them to the right person",
          "Routes calls based on department or availability",
          "Provides basic information like hours, location, and services",
          "Logs every call so nothing gets lost",
        ],
        "documentation": {
          "overview": "Every business needs someone at the front door. When a customer calls, they expect a real person to pick up — not a maze of phone menus. A receptionist handles that first contact professionally, making sure every caller feels heard and gets where they need to go.\n\nBut hiring a full-time receptionist is expensive, and someone has to cover lunch breaks, sick days, and after hours. That's where this service comes in. It works like a dedicated receptionist who never takes a day off, never puts someone on hold by mistake, and never forgets a message.\n\nYour callers get a warm, professional experience every single time. And your team gets messages that are clear, complete, and delivered to the right inbox — not scribbled on a sticky note.",
          "howItWorks": [
            {"step": 1, "title": "A Customer Calls", "description": "The phone rings and the service picks up within seconds with a professional greeting using your business name."},
            {"step": 2, "title": "The Call Is Handled", "description": "The caller explains what they need. The service follows your script — answering common questions, taking a message, or routing the call."},
            {"step": 3, "title": "Messages Are Delivered", "description": "Every message is typed up clearly and sent to the right person on your team via email, text, or your preferred channel."},
            {"step": 4, "title": "You Stay Informed", "description": "You get a daily summary of all calls handled, messages taken, and any callers that need a callback."},
          ],
          "benefits": [
            {"title": "Never Miss a Customer Call", "description": "Every call gets answered, every message gets delivered. No more lost voicemails or missed opportunities because nobody was at the desk.", "metric": "100% call answer rate"},
            {"title": "Save $35,000+ Per Year", "description": "A full-time receptionist costs salary, benefits, and overhead. This service delivers the same result at a fraction of the cost.", "metric": "80% cheaper than a full-time hire"},
            {"title": "Professional First Impression", "description": "Your callers hear a polished, friendly voice every time. It sets the tone for their entire experience with your business.", "metric": "4.8/5 caller satisfaction"},
          ],
          "useCases": [
            {"title": "You Run a Busy Dental Office", "description": "Your front desk is juggling patients, phone calls, and scheduling all at once. Calls go to voicemail during lunch and the phones ring off the hook on Monday mornings. Now every call gets answered immediately, messages go straight to the right hygienist or dentist, and your front desk team can focus on the patients in front of them."},
            {"title": "You're a Solo Consultant", "description": "You can't answer the phone when you're with a client, but you also can't afford to miss a potential lead. Every call gets answered professionally, messages are sent to you instantly, and you call back on your own schedule. Your clients never hear a busy signal."},
            {"title": "You Manage a Property Management Company", "description": "Tenants call with maintenance requests, prospects call about availability, and vendors call about appointments. Each type of call gets routed to the right team member automatically, and every message includes the details your team needs to take action."},
          ]
        }
      },
      {
        "name": "Appointment Intake",
        "description": "Collects all the right information from new clients before their first meeting.",
        "capabilities": [
          "Asks new clients a series of intake questions via phone, text, or form",
          "Collects contact details, reason for visit, and any required documents",
          "Sends appointment confirmations with all relevant details",
          "Flags incomplete intake forms and follows up automatically",
          "Organizes intake data into a clean summary for your team",
        ],
        "documentation": {
          "overview": "The first meeting with a new client sets the tone for everything that follows. But if you show up without knowing anything about them, you waste the first 15 minutes asking basic questions. Appointment intake makes sure you walk into every first meeting already prepared.\n\nBefore the appointment, new clients are guided through a short set of questions — the same ones your team would ask over the phone or in person. The answers are collected, organized, and delivered to you before the meeting starts.\n\nThis means your first conversation is about the real stuff — their needs, their goals, how you can help — not their address and phone number.",
          "howItWorks": [
            {"step": 1, "title": "A New Client Books an Appointment", "description": "As soon as they book, the intake process starts automatically. They receive a link to a short questionnaire or get a call from the service."},
            {"step": 2, "title": "Information Is Collected", "description": "The service asks your custom intake questions — contact info, reason for the visit, background details, anything you need to know beforehand."},
            {"step": 3, "title": "You Get a Client Summary", "description": "Before the meeting, you receive a clean summary of everything the client shared. You walk in knowing exactly who they are and what they need."},
            {"step": 4, "title": "Follow-Up If Needed", "description": "If a client doesn't complete the intake, the service sends a reminder. No chasing, no last-minute scrambling."},
          ],
          "benefits": [
            {"title": "Walk Into Every Meeting Prepared", "description": "You'll know who the client is, why they're coming, and what they need before they sit down. That first conversation starts at a higher level.", "metric": "15 minutes saved per appointment"},
            {"title": "Fewer Cancellations and No-Shows", "description": "When clients go through intake before the appointment, they're more committed. They've already invested time, so they show up.", "metric": "30% fewer no-shows"},
            {"title": "Your Team Looks Professional", "description": "Showing up with a printed summary of the client's details sends a message: we're organized, we're prepared, and we value your time.", "metric": "92% client satisfaction with first visits"},
          ],
          "useCases": [
            {"title": "You Run a Law Firm", "description": "New clients need to provide case details, documents, and background info before the first consultation. Instead of your paralegal spending 20 minutes on the phone collecting this, the intake service handles it. Your attorney starts the meeting with a complete case summary in hand."},
            {"title": "You Own a Med Spa", "description": "Before any treatment, clients need to share their medical history, allergies, and goals. The intake service collects all of this ahead of time so your esthetician can focus on the treatment, not paperwork."},
            {"title": "You're a Financial Advisor", "description": "New clients need to fill out risk tolerance questionnaires, provide financial goals, and share account details. Getting this done before the first meeting means you can spend the hour actually advising, not administrating."},
          ]
        }
      },
      {
        "name": "Website Chatbot",
        "description": "Greets visitors on your website, answers questions, and books meetings for you.",
        "capabilities": [
          "Greets website visitors with a personalized message",
          "Answers frequently asked questions instantly",
          "Qualifies visitors by asking about their needs and timeline",
          "Books appointments directly into your calendar",
          "Escalates complex questions to your team via email or text",
        ],
        "documentation": {
          "overview": "When someone lands on your website, they usually have a question. If they can't find the answer in a few seconds, they leave. A chatbot keeps them engaged by having a conversation — answering questions, guiding them to the right page, and even booking a meeting right there on the spot.\n\nIt works 24/7 on your website, just like a salesperson standing at the door. It doesn't replace your team — it makes sure the visitors who are ready to talk to a human get connected to one, and the ones who just need a quick answer get served immediately.\n\nThe result: more leads captured, fewer visitors bouncing, and your team spending time on qualified prospects instead of answering the same five questions over and over.",
          "howItWorks": [
            {"step": 1, "title": "A Visitor Lands on Your Site", "description": "The chatbot appears with a friendly greeting. It can be set to trigger after a few seconds, on specific pages, or when a visitor shows intent to leave."},
            {"step": 2, "title": "The Conversation Starts", "description": "The visitor asks a question or the chatbot offers help. It answers common questions instantly — pricing, services, hours, location, whatever you've set it up to handle."},
            {"step": 3, "title": "The Visitor Gets Qualified", "description": "If the visitor seems interested, the chatbot asks a few qualifying questions: what they need, their timeline, their budget range. This filters out tire-kickers."},
            {"step": 4, "title": "A Meeting Gets Booked", "description": "When the visitor is ready, the chatbot offers to book a call or appointment. It checks your calendar and finds a time that works — no back-and-forth emails needed."},
          ],
          "benefits": [
            {"title": "Capture Leads While You Sleep", "description": "Visitors who land on your site at 11pm or on a Sunday still get instant answers and can book a meeting. You wake up to new appointments.", "metric": "3x more leads captured outside business hours"},
            {"title": "Stop Losing Visitors to Slow Responses", "description": "If a visitor has to wait for a callback, they're gone. Instant engagement keeps them on your site and moves them toward a conversation.", "metric": "40% reduction in bounce rate"},
            {"title": "Your Team Talks to Ready-to-Buy Prospects", "description": "By the time a visitor reaches your team, they've already been qualified. No more wasting time on people who aren't a fit.", "metric": "2x more meetings booked per month"},
          ],
          "useCases": [
            {"title": "You Run a Roofing Company", "description": "Homeowners land on your site after a storm, usually at night or on weekends. They want to know if you cover their area, if insurance is accepted, and how fast you can come out. The chatbot answers all three, qualifies the lead, and books an inspection — even at midnight."},
            {"title": "You Own a Gym", "description": "New members want to know about class schedules, pricing, and trial memberships. The chatbot answers these instantly and books a tour or trial class. Your front desk staff stops answering the same questions 50 times a day."},
            {"title": "You're a Wedding Photographer", "description": "Couples browsing your portfolio at 1am want to know your pricing, availability for their date, and package options. The chatbot gives them the info they need and books a consultation call for the next day."},
          ]
        }
      },
      {
        "name": "Email Triage",
        "description": "Sorts your inbox, drafts replies, and flags what actually needs your attention.",
        "capabilities": [
          "Reads and categorizes every incoming email",
          "Sorts emails by urgency, topic, and required action",
          "Drafts replies for routine questions based on your past responses",
          "Flags high-priority emails that need your personal attention",
          "Sends daily summaries of what was handled and what needs a response",
        ],
        "documentation": {
          "overview": "Most business owners spend hours every week on email — reading, sorting, replying, and trying to figure out what's important and what can wait. A lot of those emails are routine: appointment requests, pricing questions, follow-ups that don't need your personal touch.\n\nEmail triage acts like a personal assistant for your inbox. It reads every email, figures out what it is, and either handles it for you, drafts a reply for you to review, or flags it as something you need to see right away.\n\nYou stop drowning in your inbox. You see only what matters, and everything else is either handled or waiting for your quick approval.",
          "howItWorks": [
            {"step": 1, "title": "An Email Arrives", "description": "Every incoming email is read and analyzed. The service identifies the sender, the topic, and what action is needed."},
            {"step": 2, "title": "It Gets Sorted", "description": "Emails are categorized: routine inquiries get auto-drafted replies, urgent items get flagged for you, and newsletters or CCs get filed away."},
            {"step": 3, "title": "Drafts Are Sent for Review", "description": "For routine emails, a reply is drafted in your voice. You review and send with one click, or let it send automatically if you prefer."},
            {"step": 4, "title": "You See What Matters", "description": "Each day, you get a summary: what was handled, what's waiting for your reply, and what needs immediate attention."},
          ],
          "benefits": [
            {"title": "Reclaim 10+ Hours a Week", "description": "Stop spending your mornings sorting through emails. Routine messages get handled, and you only see the ones that truly need you.", "metric": "10 hours saved per week"},
            {"title": "Respond Faster to What Matters", "description": "Urgent emails from clients or partners get flagged immediately. You see them first, not buried under a pile of newsletters.", "metric": "3x faster response to priority emails"},
            {"title": "Nothing Falls Through the Cracks", "description": "Every email gets read, categorized, and either handled or flagged. No more realizing three weeks later that you forgot to reply.", "metric": "99% of emails handled or flagged"},
          ],
          "useCases": [
            {"title": "You're a Real Estate Agent", "description": "You get emails from buyers, sellers, lenders, and title companies — all day, every day. Some need your immediate response, some are just keeping you in the loop. Email triage sorts them all, drafts replies for the routine stuff, and makes sure you see the time-sensitive offers first."},
            {"title": "You Run a Small Law Practice", "description": "Client emails are privileged and need careful handling. But you also get court notices, vendor emails, and CLE reminders. The triage service separates the urgent legal matters from the administrative noise so you can focus on your cases."},
            {"title": "You Own an E-Commerce Store", "description": "Customer questions about orders, shipping, and returns flood your inbox daily. Most are the same questions over and over. The triage service drafts accurate replies for common questions and flags the unusual ones for your personal attention."},
          ]
        }
      },
      {
        "name": "Voicemail Transcriber",
        "description": "Transcribes your voicemails into text and sends you a clear summary.",
        "capabilities": [
          "Transcribes voicemail messages into accurate text",
          "Identifies the caller and their reason for calling",
          "Sends transcriptions to your email or text message",
          "Flags urgent voicemails for immediate attention",
          "Organizes transcriptions by date, caller, and priority",
        ],
        "documentation": {
          "overview": "Voicemails are one of the most frustrating parts of business. You have to stop what you're doing, dial in, listen to a message (often twice), and then try to remember what they said. And half the time, the person mumbles or calls from a noisy place.\n\nThis service listens to every voicemail and turns it into a clean text transcription. You read it in seconds instead of listening for two minutes. It also identifies who called, what they want, and whether it's urgent.\n\nYou stay productive. You handle messages on your time. And you never miss the details because you can read the transcription as many times as you need.",
          "howItWorks": [
            {"step": 1, "title": "Someone Leaves a Voicemail", "description": "The service picks up the voicemail and begins transcribing immediately."},
            {"step": 2, "title": "The Message Is Transcribed", "description": "Speech is converted to text with high accuracy. The service identifies the caller if they're in your contacts."},
            {"step": 3, "title": "You Receive the Summary", "description": "A clean text summary arrives in your inbox or as a text message. It includes the caller's name, the message, and a priority flag."},
            {"step": 4, "title": "You Take Action", "description": "Read the transcription, call back, forward it to a team member, or file it away. Everything is searchable and organized."},
          ],
          "benefits": [
            {"title": "Read Messages in Seconds", "description": "Scanning a text transcription takes five seconds. Listening to a voicemail takes two minutes. When you have ten voicemails, that's the difference between one minute and twenty.", "metric": "90% faster message processing"},
            {"title": "Never Miss Important Details", "description": "Phone numbers, email addresses, and specific requests are captured in text. No more rewinding a voicemail three times to catch a phone number.", "metric": "100% of details captured in text"},
            {"title": "Searchable Message History", "description": "Every transcription is stored and searchable. Need to find what a client said three weeks ago? Search by name or keyword.", "metric": "Full search across all voicemails"},
          ],
          "useCases": [
            {"title": "You're a Contractor", "description": "Subcontractors and suppliers leave voicemails with bid details, schedule changes, and material lists. Instead of listening to each one while you're on a job site, you read the transcriptions during your lunch break and respond with one tap."},
            {"title": "You Run a Medical Practice", "description": "Patients call after hours with prescription refill requests, appointment changes, and questions. The transcriber captures every detail accurately so your staff can handle them in the morning without playing phone tag."},
            {"title": "You're a Freelance Designer", "description": "Clients leave voicemails describing their vision, giving feedback, or changing direction. Having a written record of every message means you can look back at exactly what they said — no more 'I never said that' moments."},
          ]
        }
      },
      {
        "name": "Call Screener",
        "description": "Screens your calls and only forwards the ones that matter to you.",
        "capabilities": [
          "Answers every incoming call and asks who's calling and why",
          "Checks the caller against your priority list",
          "Blocks spam and robocalls automatically",
          "Forwards important calls to your phone immediately",
          "Takes messages for calls you choose not to take",
        ],
        "documentation": {
          "overview": "Not every call deserves your personal time. Sales pitches, robocalls, and wrong numbers eat into your day. But you also can't ignore every unknown number — it could be a client, a partner, or an urgent matter.\n\nA call screener sits between you and the outside world. It answers every call, figures out who's calling and why, and then makes a decision: forward it to you, take a message, or politely decline.\n\nYou stay focused on your work without worrying that you're missing something important. The calls that matter get through. Everything else gets handled.",
          "howItWorks": [
            {"step": 1, "title": "A Call Comes In", "description": "The screener answers with your business greeting and asks who's calling and what the call is about."},
            {"step": 2, "title": "The Caller Is Identified", "description": "If the caller is on your priority list, the call goes straight to you. If not, the screener asks a few qualifying questions."},
            {"step": 3, "title": "A Decision Is Made", "description": "Based on your rules, the call is either forwarded to you, sent to voicemail, or a message is taken. Spam and blocked numbers are handled automatically."},
            {"step": 4, "title": "You Get a Summary", "description": "At the end of each day, you see a log of every call: who called, what they wanted, and what action was taken."},
          ],
          "benefits": [
            {"title": "Stop Wasting Time on Sales Calls", "description": "Telemarketers, robocalls, and cold pitches get filtered out. You only hear from people who have a legitimate reason to reach you.", "metric": "70% fewer interruptions from unwanted calls"},
            {"title": "Never Miss a Priority Call", "description": "Your important clients, partners, and contacts always get through. The screener knows who matters to you.", "metric": "100% of priority calls forwarded"},
            {"title": "Work Without Interruptions", "description": "You can focus on deep work, meetings, or time with family without your phone ringing constantly. Calls come through only when they should.", "metric": "3x more focused work time"},
          ],
          "useCases": [
            {"title": "You're a CEO or Business Owner", "description": "Your time is your most valuable asset. Every minute on a sales call is a minute not spent growing your business. The screener makes sure you only take calls that move the needle."},
            {"title": "You're a Therapist or Counselor", "description": "You can't take calls during sessions, but clients in crisis need to reach you. The screener knows which clients to put through immediately and which can wait until you're available."},
            {"title": "You're a Homeowner Who Runs a Business", "description": "You want to be able to screen calls without hiring a receptionist. When you're with your family, the screener handles everything. When you're working, it forwards the calls you want to take."},
          ]
        }
      },
      {
        "name": "Message Consolidator",
        "description": "Combines messages from email, text, social media, and your website into one inbox.",
        "capabilities": [
          "Pulls messages from email, SMS, social media DMs, and web forms",
          "Combines conversations with the same person across platforms",
          "Shows you one unified thread per contact",
          "Lets you reply from one place and sends to the right channel",
          "Flags unread messages and tracks response times",
        ],
        "documentation": {
          "overview": "Your customers don't care which channel they use to reach you. They'll send a Facebook message, then follow up by email, then text you. Without a consolidator, you're checking five different apps and hoping you don't miss something.\n\nThis service pulls every message from every channel into one place. When a customer reaches out, you see the full conversation — every message they sent, on every platform — in one clean thread. You reply once, and it goes to the right place.\n\nOne inbox. Every message. Zero missed conversations.",
          "howItWorks": [
            {"step": 1, "title": "Messages Come In", "description": "A customer sends you a message on any channel — email, text, Instagram DM, Facebook message, or your website contact form."},
            {"step": 2, "title": "Everything Gets Pulled Together", "description": "The consolidator identifies the sender and adds the message to their conversation thread, no matter which channel it came from."},
            {"step": 3, "title": "You See One Thread", "description": "When you open a contact, you see every message from that person across all channels, in order. No switching between apps."},
            {"step": 4, "title": "You Reply Once", "description": "Your reply goes out on the same channel the customer used. They never know you're managing everything from one place."},
          ],
          "benefits": [
            {"title": "One Inbox for Everything", "description": "Stop checking email, then texts, then Facebook, then Instagram. Every message lives in one place, organized by contact.", "metric": "5 apps consolidated into 1"},
            {"title": "Never Miss a Customer Message", "description": "When everything flows into one inbox, nothing gets lost in the shuffle. Every message gets seen and every customer gets a response.", "metric": "99% message response rate"},
            {"title": "Faster Response Times", "description": "You see the full conversation history instantly. No asking 'remind me what we discussed' — it's all right there.", "metric": "50% faster response times"},
          ],
          "useCases": [
            {"title": "You Run a Local Bakery", "description": "Customers place orders through Instagram DMs, call the shop, and fill out your website form. Without a consolidator, you're checking three places. Now every order and question shows up in one inbox, and you reply from one spot."},
            {"title": "You're a Personal Trainer", "description": "Clients text you about scheduling, email you about nutrition plans, and DM you on Instagram about workouts. The consolidator puts every conversation with each client in one thread so you always have the full picture."},
            {"title": "You Own a Small Retail Store", "description": "Customers ask questions on Facebook Marketplace, send emails about orders, and text about pickup times. Your team sees every message in one place and responds without missing a beat."},
          ]
        }
      },
      {
        "name": "FAQ Assistant",
        "description": "Answers common questions from callers and visitors automatically, day or night.",
        "capabilities": [
          "Learns your most frequently asked questions and their answers",
          "Answers questions via phone, chat, or text message",
          "Provides consistent answers every time",
          "Escalates questions it can't answer to your team",
          "Updates answers when you tell it something has changed",
        ],
        "documentation": {
          "overview": "Your team answers the same questions every single day. What are your hours? Do you offer financing? Where are you located? What's your return policy? It's repetitive, it's time-consuming, and it's the kind of work that burns people out.\n\nAn FAQ assistant handles all of that for you. It knows the answers to every common question about your business and delivers them instantly — whether someone calls, texts, or chats with you online.\n\nYour team stops being a human FAQ page and gets back to the work that actually needs a human.",
          "howItWorks": [
            {"step": 1, "title": "You Teach It Your FAQs", "description": "You provide the questions your customers ask most often and the answers you want given. The assistant learns them and starts answering immediately."},
            {"step": 2, "title": "A Customer Asks a Question", "description": "Whether by phone, chat, or text, the customer asks their question. The assistant recognizes it and provides the answer instantly."},
            {"step": 3, "title": "The Answer Is Delivered", "description": "The customer gets a clear, accurate answer in seconds. No waiting on hold, no being transferred, no 'let me check with someone.'"},
            {"step": 4, "title": "Complex Questions Get Escalated", "description": "If the assistant encounters a question it doesn't know, it politely takes a message and alerts your team to follow up."},
          ],
          "benefits": [
            {"title": "Instant Answers, 24/7", "description": "Customers get answers the moment they ask the question — even at midnight, on weekends, and during holidays.", "metric": "24/7 availability for common questions"},
            {"title": "Your Team Stops Answering the Same Questions", "description": "Free your team from the daily grind of 'what are your hours' and 'do you ship to my area.' They focus on the work that needs a human touch.", "metric": "60% fewer routine questions for your team"},
            {"title": "Consistent Answers Every Time", "description": "The assistant gives the same accurate answer every time. No miscommunications, no outdated information, no 'I thought someone told me differently.'", "metric": "100% answer consistency"},
          ],
          "useCases": [
            {"title": "You Run a Car Dealership", "description": "Every day, callers ask about your hours, current inventory, financing options, and whether you buy used cars. The FAQ assistant answers all of these instantly, and only routes the serious buyers to your sales team."},
            {"title": "You Own a Restaurant", "description": "People call to ask about your menu, hours, whether you take reservations, and if you have gluten-free options. The assistant handles all of it, and your host can focus on seating guests."},
            {"title": "You're an Accountant", "description": "Tax season brings the same questions every year: What documents do I need? When is the deadline? Do you handle business returns? The FAQ assistant answers these on repeat so you can focus on the actual tax work."},
          ]
        }
      },
      {
        "name": "Customer Communication Hub",
        "description": "Manages all customer communications across phone, email, text, and social from one dashboard.",
        "capabilities": [
          "Pulls messages from phone, email, SMS, and social media into one view",
          "Routes each message to the right team member based on rules you set",
          "Tracks response times and flags overdue replies",
          "Sends automated acknowledgments when a message is received",
          "Logs every interaction to the customer's conversation history",
        ],
        "documentation": {
          "overview": "Your customers reach you on different channels — a phone call, an email, a text, a Facebook message, a comment on your Instagram post. Without a central hub, your team is scattered across inboxes, missing messages, and duplicating effort.\n\nA customer communication hub brings every message into one dashboard. Every inbound communication — regardless of channel — appears in one queue, gets routed to the right person, and gets tracked until it's resolved. Your team sees the full conversation history with each customer, no matter which channel they used.\n\nNo more missed messages. No more 'I didn't see that email.' No more customers falling through the cracks because their message landed in the wrong inbox.",
          "howItWorks": [
            {"step": 1, "title": "Messages Arrive on Any Channel", "description": "A customer calls, emails, texts, or sends a social media message. Every message flows into the communication hub automatically."},
            {"step": 2, "title": "Messages Get Routed", "description": "Based on your rules, each message is assigned to the right team member. Billing questions go to finance. Technical issues go to support. Sales inquiries go to your sales team."},
            {"step": 3, "title": "Response Times Are Tracked", "description": "The hub monitors how long each message sits unanswered. If a response is overdue, it escalates to a manager. No message sits ignored."},
            {"step": 4, "title": "Every Interaction Is Logged", "description": "Every message, every reply, every channel switch is logged to the customer's history. Anyone on your team can pick up the conversation without missing a beat."},
          ],
          "benefits": [
            {"title": "Zero Missed Messages", "description": "Every inbound communication — phone, email, text, social — lands in one queue. Nothing gets lost in the shuffle between platforms.", "metric": "100% message capture across all channels"},
            {"title": "Faster Response Times", "description": "Automatic routing and overdue alerts mean messages get answered faster. Your team sees what needs attention now, not what they remembered to check.", "metric": "40% faster average response time"},
            {"title": "Full Conversation History", "description": "When a customer switches from email to phone to text, your team sees the full thread. No asking 'remind me what we discussed' — it's all right there.", "metric": "Complete cross-channel conversation history"},
          ],
          "useCases": [
            {"title": "You Run a Property Management Company", "description": "Tenants text about maintenance requests, owners email about financials, and vendors call about appointments. The communication hub routes each type of message to the right team member and tracks every interaction. No more 'I thought you were handling that' between team members."},
            {"title": "You Own an E-Commerce Store", "description": "Customers ask about orders via email, post questions on Instagram, and leave voicemails after hours. The communication hub consolidates everything into one queue. Your support team sees every message in one place and responds on the right channel."},
            {"title": "You're a Medical Practice", "description": "Patients call the office, send messages through the patient portal, and email questions. The communication hub routes prescription refills to clinical staff, billing questions to the front desk, and urgent messages to the on-call doctor. Every interaction is logged to the patient record."},
          ]
        }
      },
    ]
  },
  {
    "department": "Scheduling & Bookings",
    "icon": "calendar",
    "items": [
      {
        "name": "Calendar Manager",
        "description": "Manages your calendar, prevents conflicts, and keeps your schedule running smoothly.",
        "capabilities": [
          "Manages your calendar across multiple platforms",
          "Schedules meetings based on your availability preferences",
          "Prevents double-bookings and resolves conflicts automatically",
          "Sends meeting invites with all necessary details",
          "Blocks focus time and personal commitments",
        ],
        "documentation": {
          "overview": "Your calendar is the backbone of your business. Every meeting, deadline, and appointment lives there. But managing it is a constant battle — finding times that work for everyone, avoiding conflicts, and making sure nothing slips through the cracks.\n\nA calendar manager takes all of that off your plate. It knows your availability, understands your preferences, and handles the back-and-forth of scheduling so you never have to send 'does Tuesday work?' emails again.\n\nYou show up to the right meetings at the right time, and your calendar stays clean and organized without you lifting a finger.",
          "howItWorks": [
            {"step": 1, "title": "Someone Wants to Meet", "description": "A client, colleague, or partner wants to schedule a time. They see your real-time availability and pick a slot that works for them."},
            {"step": 2, "title": "The Meeting Is Booked", "description": "The calendar manager checks your schedule, confirms there's no conflict, and books the meeting. An invite goes out to everyone involved."},
            {"step": 3, "title": "Reminders Go Out", "description": "Before the meeting, reminders are sent to all participants. If someone needs to reschedule, the manager finds a new time automatically."},
            {"step": 4, "title": "Your Calendar Stays Clean", "description": "Focus time, personal commitments, and buffer time between meetings are all protected. Your calendar works for you, not against you."},
          ],
          "benefits": [
            {"title": "Eliminate Scheduling Back-and-Forth", "description": "The endless email chain of 'how about Tuesday?' 'No, try Thursday?' is over. People pick from your available times and it's done.", "metric": "90% less scheduling email"},
            {"title": "Never Get Double-Booked", "description": "The manager checks every booking against your existing schedule. Conflicts are caught before they happen, not after.", "metric": "Zero double-bookings"},
            {"title": "Protect Your Focus Time", "description": "The manager blocks time for deep work, lunch, and personal commitments. Your calendar won't fill up with meetings every waking hour.", "metric": "10+ hours of focus time protected weekly"},
          ],
          "useCases": [
            {"title": "You're a Consultant with Clients in Multiple Time Zones", "description": "Scheduling across time zones is a nightmare. You're always doing mental math and getting it wrong. The calendar manager handles time zones automatically, showing each client their local time and finding slots that actually work for everyone."},
            {"title": "You Run a Hair Salon", "description": "Clients book appointments, stylists have different schedules, and walk-ins complicate everything. The calendar manager keeps it all straight — matching clients to stylists, managing the waitlist when someone cancels, and making sure you're never overbooked."},
            {"title": "You're a Recruiter", "description": "You're scheduling interviews between candidates and hiring managers across different departments. Everyone has limited availability. The calendar manager finds the overlap, books the interview, and sends reminders so nobody forgets."},
          ]
        }
      },
      {
        "name": "Booking Agent",
        "description": "Handles appointment scheduling for your clients so they can book anytime.",
        "capabilities": [
          "Lets clients book appointments online 24/7",
          "Checks your real-time availability before confirming",
          "Sends confirmation emails or texts with appointment details",
          "Handles rescheduling and cancellations automatically",
          "Collects payment or deposits at the time of booking",
        ],
        "documentation": {
          "overview": "When a client wants to book with you, the process should be simple: pick a time, confirm, done. But too often, it's a mess of phone tag, emails, and 'let me check my calendar.' By the time you connect, the client has already moved on to someone else.\n\nA booking agent makes it effortless. Clients see your real-time availability, pick a time that works, and the appointment is booked — instantly. Confirmations go out automatically, reminders prevent no-shows, and cancellations free up the slot for someone else.\n\nYour clients book on their schedule, not yours. And you stop being the bottleneck.",
          "howItWorks": [
            {"step": 1, "title": "A Client Wants to Book", "description": "They visit your booking page or get a link from you. Your real-time availability is displayed — only the times you're actually free."},
            {"step": 2, "title": "They Pick a Time", "description": "The client selects a time slot, provides their contact info, and confirms. If you require a deposit, they pay right then."},
            {"step": 3, "title": "Confirmation Goes Out", "description": "Both you and the client receive a confirmation with all the details: date, time, location or video link, and any preparation needed."},
            {"step": 4, "title": "Reminders Prevent No-Shows", "description": "The day before and the hour before, the client gets a reminder. If they need to cancel or reschedule, they can do it themselves — the slot opens up for someone else."},
          ],
          "benefits": [
            {"title": "Bookings Happen 24/7", "description": "Clients can book at midnight, on weekends, while you're in a meeting. You stop losing leads because someone was asleep or busy.", "metric": "2x more bookings from online scheduling"},
            {"title": "Fewer No-Shows", "description": "Automatic reminders and easy rescheduling mean clients show up — or they cancel early enough for you to fill the slot.", "metric": "35% reduction in no-shows"},
            {"title": "You Stop Playing Secretary", "description": "No more phone tag, no more 'let me check my calendar,' no more manual confirmations. The whole process runs itself.", "metric": "5 hours saved per week on scheduling"},
          ],
          "useCases": [
            {"title": "You're a Dentist", "description": "Patients need to book cleanings, consultations, and follow-ups. Instead of calling your office during business hours, they book online anytime. Your front desk stops spending half their day on the phone."},
            {"title": "You're a Personal Trainer", "description": "Clients want to book sessions around their work schedule — early mornings, lunch breaks, evenings. They see your availability and book the slot that works. You show up and train."},
            {"title": "You Run a Photography Studio", "description": "Clients book consultations, shoots, and viewing sessions. Each type has different durations and requirements. The booking agent handles the complexity so your clients see only the times that actually work."},
          ]
        }
      },
      {
        "name": "Meeting Coordinator",
        "description": "Schedules group meetings, sends reminders, and handles rescheduling when things change.",
        "capabilities": [
          "Finds meeting times that work for all attendees",
          "Sends calendar invites with agendas and preparation materials",
          "Tracks RSVPs and follows up with people who haven't responded",
          "Handles rescheduling when conflicts arise",
          "Sends reminders before the meeting starts",
        ],
        "documentation": {
          "overview": "Scheduling a meeting with two people is easy. Scheduling a meeting with ten people — all with different calendars, time zones, and priorities — is a nightmare. And when someone cancels or a conflict comes up, you're back to square one.\n\nA meeting coordinator handles the entire process. It finds a time that works for everyone, sends the invites, tracks who's coming, and handles the rescheduling when life happens.\n\nYou say 'we need a team meeting next week' and it's done.",
          "howItWorks": [
            {"step": 1, "title": "You Set Up the Meeting", "description": "You provide the attendee list, preferred date range, and any requirements — duration, location, video link needed."},
            {"step": 2, "title": "The Coordinator Finds a Time", "description": "It checks everyone's calendar and finds the best available slot. If no perfect time exists, it suggests the closest options."},
            {"step": 3, "title": "Invites Go Out", "description": "Everyone receives a calendar invite with the agenda, location or video link, and any materials they need to review beforehand."},
            {"step": 4, "title": "Reminders and Follow-Ups", "description": "The coordinator tracks RSVPs, nudges people who haven't responded, and sends reminders the day before and the hour before the meeting."},
          ],
          "benefits": [
            {"title": "Schedule Group Meetings in Seconds", "description": "What used to take 20 emails and three days of back-and-forth now takes 30 seconds. The coordinator does the work.", "metric": "95% less time scheduling group meetings"},
            {"title": "Everyone Shows Up Prepared", "description": "Agendas and materials go out with the invite, not the morning of the meeting. People come ready to contribute.", "metric": "2x more productive meetings"},
            {"title": "Rescheduling Is Painless", "description": "When someone cancels or a conflict comes up, the coordinator finds a new time and updates everyone. No manual re-scheduling.", "metric": "80% less rescheduling effort"},
          ],
          "useCases": [
            {"title": "You're a Project Manager", "description": "Your team spans three departments and two time zones. Every sprint planning session requires finding a 90-minute window where everyone's free. The coordinator checks every calendar and books it in seconds."},
            {"title": "You Run a Board of Directors", "description": "Getting 12 board members in the same room — or on the same video call — is a logistical challenge. The coordinator handles the scheduling, sends the board package with the agenda, and makes sure everyone gets there."},
            {"title": "You're a Wedding Planner", "description": "You need to schedule venue tours, vendor meetings, and client check-ins — all while coordinating with the couple's availability. The coordinator keeps every appointment on track."},
          ]
        }
      },
      {
        "name": "Availability Tracker",
        "description": "Syncs across all your calendars and shows your real-time availability to others.",
        "capabilities": [
          "Syncs with Google Calendar, Outlook, and Apple Calendar",
          "Shows real-time availability to clients and colleagues",
          "Blocks off personal time and vacations automatically",
          "Updates availability across all platforms instantly",
          "Lets you set different availability for different types of meetings",
        ],
        "documentation": {
          "overview": "You have a work calendar, a personal calendar, and maybe a shared team calendar. When someone wants to book time with you, they have no idea which calendar to check — and neither do you half the time.\n\nAn availability tracker syncs everything into one view. It shows when you're actually free across all your calendars, and it updates in real time. When you add something to your personal calendar, your work availability reflects it instantly.\n\nNo more double-bookings. No more 'I thought I was free.' Just one clear picture of when you're available.",
          "howItWorks": [
            {"step": 1, "title": "Your Calendars Are Connected", "description": "Link your work, personal, and shared calendars. The tracker reads them all and builds a complete picture of your schedule."},
            {"step": 2, "title": "Availability Is Calculated", "description": "The tracker identifies your free slots across all calendars. It only shows times when you're genuinely available everywhere."},
            {"step": 3, "title": "Others See Your Real-Time Status", "description": "When someone wants to book with you, they see only your available times. Your private appointments stay hidden — they just show as 'busy.'"},
            {"step": 4, "title": "Everything Stays in Sync", "description": "Add an event to any calendar and the availability updates everywhere instantly. No manual syncing, no delays."},
          ],
          "benefits": [
            {"title": "One View of Your Schedule", "description": "Stop checking three calendars to figure out if you're free. Everything is in one place, always up to date.", "metric": "All calendars synced in real time"},
            {"title": "No More Double-Bookings", "description": "When your personal trainer appointment is on your work calendar, nobody can book over it. Everything is accounted for.", "metric": "Zero scheduling conflicts"},
            {"title": "Your Privacy Is Protected", "description": "People see your availability, not your private appointments. 'Doctor's appointment' stays between you and your doctor.", "metric": "Full privacy for personal events"},
          ],
          "useCases": [
            {"title": "You're a Doctor with a Busy Practice", "description": "You have a clinic calendar, a hospital rounds schedule, and a personal calendar. Patients booking online see only the slots where you're actually free across all three. No more scheduling conflicts between clinic and hospital."},
            {"title": "You're a Freelancer with Multiple Clients", "description": "Each client wants to book time on your calendar. The availability tracker shows them all the same real-time view of your open slots, so you never get overbooked."},
            {"title": "You're a Parent Who Works from Home", "description": "School pickups, soccer practice, and your partner's travel schedule all affect when you can work. The tracker syncs your personal and work calendars so colleagues never book over your kid's recital."},
          ]
        }
      },
      {
        "name": "Reminder Service",
        "description": "Sends reminders for upcoming appointments, deadlines, and important dates.",
        "capabilities": [
          "Sends reminders via email, text, or phone call",
          "Customizes reminder timing — 1 day before, 1 hour before, or whatever you need",
          "Tracks which reminders have been acknowledged",
          "Sends follow-up reminders if no confirmation is received",
          "Manages recurring reminders for regular commitments",
        ],
        "documentation": {
          "overview": "People forget things. Appointments, deadlines, payments, meetings — it happens to everyone. A polite reminder makes all the difference between a client who shows up and a client who doesn't.\n\nA reminder service makes sure nobody forgets the important stuff. It sends timely reminders through whatever channel works best — text, email, or a phone call — and it follows up if needed.\n\nYour clients and team stay on track, and you stop being the person who has to say 'don't forget about tomorrow.'",
          "howItWorks": [
            {"step": 1, "title": "You Set Up Reminders", "description": "For each appointment, deadline, or event, you set when reminders should go out. One day before? One hour before? Both? You decide."},
            {"step": 2, "title": "Reminders Go Out Automatically", "description": "At the right time, the service sends the reminder through the chosen channel — text, email, or phone call."},
            {"step": 3, "title": "Confirmation Is Tracked", "description": "If the reminder asks for confirmation (like 'reply YES to confirm'), the service tracks who responded and who didn't."},
            {"step": 4, "title": "Follow-Ups Are Sent", "description": "If someone doesn't respond to the first reminder, a follow-up goes out. You get a report of who's confirmed and who needs a nudge."},
          ],
          "benefits": [
            {"title": "Fewer Missed Appointments", "description": "A timely reminder is the difference between a client who shows up and one who forgets. Your schedule stays full.", "metric": "40% fewer missed appointments"},
            {"title": "You Stop Chasing People", "description": "No more texting clients the night before to confirm. The reminders go out automatically, and you only follow up with the people who don't respond.", "metric": "Zero manual reminder follow-ups"},
            {"title": "Recurring Reminders Run Themselves", "description": "Weekly team meetings, monthly invoices, annual renewals — set them once and the service handles them forever.", "metric": "Unlimited recurring reminders"},
          ],
          "useCases": [
            {"title": "You Run a Dental Practice", "description": "Patients forget appointments all the time. A text reminder the day before and a call the morning of means fewer empty chairs and a fuller schedule."},
            {"title": "You're a Property Manager", "description": "Rent is due on the first, inspections are quarterly, and lease renewals come up throughout the year. The reminder service tracks every deadline and makes sure nothing is missed."},
            {"title": "You're a Personal Trainer", "description": "Clients skip sessions when they forget. A text reminder 30 minutes before each session keeps your clients consistent and your schedule full."},
          ]
        }
      },
      {
        "name": "Waitlist Manager",
        "description": "Manages your waitlists and fills cancelled slots automatically.",
        "capabilities": [
          "Maintains a waitlist for fully booked time slots",
          "Automatically fills cancellations from the waitlist",
          "Notifies waitlisted people when a slot opens up",
          "Tracks waitlist position and estimated availability",
          "Sends expiration offers if someone doesn't respond in time",
        ],
        "documentation": {
          "overview": "When you're fully booked, new clients go on a waitlist. But managing that waitlist is a job in itself — tracking who's next, calling them when something opens up, and filling slots fast before they go to someone else.\n\nA waitlist manager does all of it. When a cancellation happens, the next person on the waitlist gets notified immediately. If they don't respond in time, it moves to the next person. No slot goes unfilled.\n\nYour schedule stays full, and your waitlisted clients feel like they're getting VIP treatment instead of being forgotten.",
          "howItWorks": [
            {"step": 1, "title": "Someone Cancels an Appointment", "description": "A client cancels or reschedules. The slot opens up on your calendar."},
            {"step": 2, "title": "The Waitlist Is Checked", "description": "The manager looks at the waitlist and identifies the next person who can take that specific time slot."},
            {"step": 3, "title": "An Offer Goes Out", "description": "The waitlisted person gets a notification: 'A slot just opened up at 2pm today. Want it?' They accept or decline with one tap."},
            {"step": 4, "title": "The Slot Gets Filled", "description": "If they accept, the appointment is booked. If they decline or don't respond in time, the next person on the list gets the offer."},
          ],
          "benefits": [
            {"title": "No Slot Goes Unfilled", "description": "Every cancellation is an opportunity. The waitlist manager fills slots within minutes, not days.", "metric": "95% of cancellations filled from waitlist"},
            {"title": "Happy Waitlisted Clients", "description": "People on the waitlist get first access to open slots. They feel prioritized, not forgotten.", "metric": "80% of waitlisted clients accept offers"},
            {"title": "Zero Manual Work", "description": "You don't have to call anyone or send emails. The whole process runs automatically from cancellation to confirmation.", "metric": "Zero time spent managing waitlists"},
          ],
          "useCases": [
            {"title": "You're a Popular Restaurant", "description": "Friday nights are always fully booked. When someone cancels, the waitlist manager texts the next party on the list. Your tables stay full and nobody waits long for a spot."},
            {"title": "You're a Specialist Doctor", "description": "Your schedule is booked three months out. Patients on the waitlist get notified when cancellations happen, so they get seen sooner instead of waiting months."},
            {"title": "You Run a Driving School", "description": "Driving test slots are limited and students cancel all the time. The waitlist manager fills every open slot so no instructor sits idle."},
          ]
        }
      },
      {
        "name": "Event Scheduler",
        "description": "Coordinates multi-person events, sends invitations, and tracks RSVPs.",
        "capabilities": [
          "Creates event pages with all the details",
          "Sends invitations via email with RSVP tracking",
          "Tracks who's coming, who declined, and who hasn't responded",
          "Sends reminders as the event approaches",
          "Coordinates venue, catering, and logistics reminders",
        ],
        "documentation": {
          "overview": "Planning an event — even a small one — means juggling a dozen details and a dozen people. Invitations, RSVPs, reminders, logistics — it's a lot of moving parts.\n\nAn event scheduler handles the coordination. It creates the event, sends the invitations, tracks who's coming, and sends reminders so people actually show up.\n\nYou focus on making the event great. The scheduler makes sure people know about it and show up.",
          "howItWorks": [
            {"step": 1, "title": "You Create the Event", "description": "Set the date, time, location, and details. Add the guest list. The scheduler creates a beautiful event page with everything guests need to know."},
            {"step": 2, "title": "Invitations Go Out", "description": "Each guest receives a personalized invitation via email with the event details and an RSVP button."},
            {"step": 3, "title": "RSVPs Are Tracked", "description": "You see a real-time dashboard of who's coming, who declined, and who hasn't responded. Non-responders get a gentle nudge."},
            {"step": 4, "title": "Reminders Go Out", "description": "A week before, a day before, and the morning of the event, guests receive reminders. Day-of logistics — parking, what to bring, where to go — are included."},
          ],
          "benefits": [
            {"title": "Higher Attendance Rates", "description": "Tracked RSVPs and automatic reminders mean more people show up. No more guessing how many chairs to set out.", "metric": "30% higher attendance with reminders"},
            {"title": "Less Time on Coordination", "description": "No more chasing people for RSVPs or sending reminder emails. The scheduler handles all of it.", "metric": "80% less time on event coordination"},
            {"title": "Professional Invitations", "description": "Beautiful, branded invitations that make your event look polished. Not a plain text email with a date and address.", "metric": "Professional event branding"},
          ],
          "useCases": [
            {"title": "You're a Small Business Hosting a Grand Opening", "description": "You need to invite customers, vendors, and local press. The event scheduler sends beautiful invitations, tracks who's coming, and reminds everyone the day before."},
            {"title": "You Run a Nonprofit", "description": "Your annual fundraiser needs invitations, RSVP tracking, and day-of coordination. The scheduler handles it all so your volunteers can focus on the cause."},
            {"title": "You're a Marketing Agency", "description": "You host client events, workshops, and networking nights. Each event needs invitations and follow-up. The scheduler makes every event look professional."},
          ]
        }
      },
      {
        "name": "Time Zone Coordinator",
        "description": "Handles scheduling across time zones so nobody has to do mental math.",
        "capabilities": [
          "Detects each participant's time zone automatically",
          "Displays meeting times in each person's local time",
          "Suggests optimal meeting windows across multiple zones",
          "Adjusts for daylight saving time changes",
          "Sends calendar events with correct local times for everyone",
        ],
        "documentation": {
          "overview": "Scheduling across time zones is where mistakes happen. You tell someone 3pm and you mean Eastern, but they think Pacific. Now someone's an hour late and everyone's frustrated.\n\nA time zone coordinator eliminates the confusion. It knows where everyone is, shows each person the meeting time in their own zone, and makes sure the calendar event is correct for everyone.\n\nYou schedule once. Everyone shows up at the right time. No math, no mistakes, no 'I thought you meant my time zone.'",
          "howItWorks": [
            {"step": 1, "title": "You Add Participants", "description": "When scheduling a meeting, you add the attendees. The coordinator detects each person's time zone from their calendar settings or location."},
            {"step": 2, "title": "Optimal Times Are Found", "description": "The coordinator analyzes everyone's availability across time zones and suggests the best windows — times that are reasonable for all participants."},
            {"step": 3, "title": "Local Times Are Shown", "description": "Each participant sees the meeting time in their own zone. The invite says '2:00 PM Pacific / 5:00 PM Eastern' so there's no confusion."},
            {"step": 4, "title": "Calendar Events Are Accurate", "description": "When the event is added to each person's calendar, it's set to the correct local time. Daylight saving changes are handled automatically."},
          ],
          "benefits": [
            {"title": "No More Time Zone Mistakes", "description": "Everyone sees the meeting in their own time. No more showing up an hour early or late because of a time zone mix-up.", "metric": "Zero time zone scheduling errors"},
            {"title": "Fair Meeting Times", "description": "The coordinator finds times that work for everyone — not just convenient for one time zone.", "metric": "Optimal time slots for all participants"},
            {"title": "Daylight Saving Is Handled", "description": "When clocks change, the coordinator adjusts automatically. No more 'did we account for the time change?' panic.", "metric": "Automatic daylight saving adjustments"},
          ],
          "useCases": [
            {"title": "You're a Remote Team Spread Across the Globe", "description": "Your developers are in India, your designers in Europe, and your sales team in the US. Finding a meeting time that doesn't require someone to join at midnight is a challenge. The coordinator finds the overlap."},
            {"title": "You're a Consultant with International Clients", "description": "You have clients in New York, London, and Tokyo. Scheduling calls across those zones means someone always has an early morning or late evening. The coordinator finds the least painful option."},
            {"title": "You Run a Global E-Commerce Business", "description": "Your suppliers are in China, your warehouse is in Texas, and your customer service team is in the Philippines. Coordinating calls across all three zones requires a system that just works."},
          ]
        }
      },
      {
        "name": "Booking & Payment Bundle",
        "description": "Combines appointment booking with deposit or payment collection in one seamless flow.",
        "capabilities": [
          "Lets clients book and pay in a single transaction",
          "Collects deposits or full payment at the time of booking",
          "Automatically refunds or adjusts payments when appointments are rescheduled",
          "Sends payment confirmations alongside booking confirmations",
          "Tracks payment status for every booked appointment",
        ],
        "documentation": {
          "overview": "Booking an appointment is one thing. Getting paid for it is another. When these are separate steps, you get no-shows, last-minute cancellations, and awkward payment conversations.\n\nA booking and payment bundle combines both into one flow. Your client picks a time, pays a deposit or full amount, and the appointment is confirmed — all in one go. If they cancel, the refund process is automatic. If they reschedule, the payment adjusts.\n\nYou get paid before the appointment happens. Your no-show rate drops. And your clients are more committed because they've already invested.",
          "howItWorks": [
            {"step": 1, "title": "A Client Wants to Book", "description": "They visit your booking page and see your real-time availability. Each time slot shows the required deposit or payment amount alongside it."},
            {"step": 2, "title": "They Book and Pay", "description": "The client selects a time, provides their details, and pays the deposit or full amount. The appointment is only confirmed once payment is processed."},
            {"step": 3, "title": "Confirmations Go Out", "description": "Both you and the client receive a confirmation with the appointment details and the payment receipt. Everything is documented in one place."},
            {"step": 4, "title": "Cancellations Are Handled", "description": "If the client cancels, the refund is processed automatically based on your cancellation policy. The slot opens up for someone else, and your revenue is protected."},
          ],
          "benefits": [
            {"title": "Fewer No-Shows", "description": "When clients pay upfront, they show up. The deposit creates commitment, and your schedule stays full.", "metric": "50% reduction in no-shows"},
            {"title": "Cash Flow Before the Appointment", "description": "You collect payment when the booking is made, not after the service is delivered. Your cash flow improves and you reduce unpaid invoices.", "metric": "100% of bookings prepaid"},
            {"title": "Zero Awkward Payment Conversations", "description": "Payment is part of the booking flow, not a separate conversation. Your team never has to chase a client for payment before an appointment.", "metric": "Zero payment-related follow-ups"},
          ],
          "useCases": [
            {"title": "You're a Med Spa", "description": "Every treatment requires a deposit to secure the booking. The booking and payment bundle collects the deposit when the client books, sends a confirmation with the payment receipt, and processes a refund if they cancel with enough notice. Your schedule stays full and your front desk stops chasing deposits."},
            {"title": "You're a Consultant", "description": "You require a 50% deposit before any engagement. The booking and payment bundle lets prospects book a consultation and pay the deposit in one step. No more sending separate invoices and waiting for payment before you'll confirm the meeting."},
            {"title": "You Run a Rental Business", "description": "Customers book equipment or venues and pay at the same time. The system holds the booking only after payment clears, and automatically processes refunds for cancellations. You stop losing revenue to unconfirmed bookings."},
          ]
        }
      },
    ]
  },
  {
    "department": "Sales & Outreach",
    "icon": "target",
    "items": [
      {
        "name": "Lead Follow-Up",
        "description": "Calls and emails new leads within minutes, not days.",
        "capabilities": [
          "Contacts new leads within minutes of them reaching out",
          "Follows a customizable script for initial contact",
          "Logs every interaction and its outcome",
          "Schedules follow-up calls or emails automatically",
          "Moves unresponsive leads to a nurture sequence",
        ],
        "documentation": {
          "overview": "Speed kills — or in sales, speed wins. The first company to contact a new lead is the one that wins the sale. But most businesses take hours or even days to follow up, and by then, the lead has gone cold.\n\nA lead follow-up service contacts your new leads within minutes. It calls, emails, or texts them while their interest is still hot, starts the conversation, and moves them toward a meeting or a sale.\n\nYou stop losing leads to slow response times. Every inquiry gets an instant, professional follow-up.",
          "howItWorks": [
            {"step": 1, "title": "A New Lead Comes In", "description": "Someone fills out your form, calls your business, or sends an email. The lead follow-up service is notified instantly."},
            {"step": 2, "title": "Contact Is Made Within Minutes", "description": "The service reaches out to the lead using your preferred method — phone, email, or text — with a professional message that starts the conversation."},
            {"step": 3, "title": "The Conversation Is Guided", "description": "Using your script, the service asks qualifying questions, gauges interest, and moves the lead toward the next step — a demo, a call with your sales team, or a proposal."},
            {"step": 4, "title": "Follow-Up Is Scheduled", "description": "If the lead isn't ready to buy yet, the service schedules follow-up contact. If they're ready, they're handed off to your sales team immediately."},
          ],
          "benefits": [
            {"title": "Contact Leads 50x Faster", "description": "The average business takes 42 hours to follow up. This service does it in under 5 minutes. That speed wins deals.", "metric": "50x faster lead response time"},
            {"title": "2x More Leads Converted", "description": "Following up within 5 minutes makes you 100x more likely to connect with a lead. More connections means more sales.", "metric": "2x more leads converted to customers"},
            {"title": "Zero Leads Fall Through the Cracks", "description": "Every lead gets contacted, every interaction gets logged, and every follow-up gets scheduled. Nothing is forgotten.", "metric": "100% of leads contacted"},
          ],
          "useCases": [
            {"title": "You're a Real Estate Agent", "description": "A potential buyer fills out a form on your listing at 9pm. By 9:05pm, they've already gotten a text from you asking about their timeline and budget. By the time other agents call the next morning, you've already scheduled a showing."},
            {"title": "You Run a Roofing Company", "description": "After a storm, your website gets flooded with inquiries. The lead follow-up service contacts each one within minutes, qualifies them by phone, and books inspections before your competitors even check their email."},
            {"title": "You're a SaaS Startup", "description": "Someone signs up for a free trial. Within minutes, they get a welcome email and a follow-up call. You learn what they're looking for and guide them toward the features that matter — before they churn."},
          ]
        }
      },
      {
        "name": "Proposal Generator",
        "description": "Creates professional quotes and proposals from your templates in minutes.",
        "capabilities": [
          "Generates proposals from your existing templates",
          "Customizes each proposal with client-specific details",
          "Includes pricing, scope, timeline, and terms",
          "Sends proposals via email with tracking",
          "Follows up if the client hasn't responded",
        ],
        "documentation": {
          "overview": "Creating a proposal takes time. You pull up a template, fill in the client's name, adjust the pricing, write up the scope, add the timeline, and hope you didn't forget anything. Then you send it and wait.\n\nA proposal generator does all of that in minutes. You provide the client's needs and your pricing, and it creates a polished, professional proposal based on your templates. It even follows up if the client doesn't respond.\n\nYou send more proposals in less time, and every one of them looks like it was crafted by your best salesperson.",
          "howItWorks": [
            {"step": 1, "title": "You Provide the Details", "description": "After a sales call or meeting, you input the client's needs, the scope of work, and the pricing. The generator pulls from your templates."},
            {"step": 2, "title": "The Proposal Is Created", "description": "A complete proposal is generated with all the sections: executive summary, scope, pricing, timeline, terms, and next steps. It looks professional and on-brand."},
            {"step": 3, "title": "It Goes to the Client", "description": "The proposal is sent via email with tracking. You know when it's opened and how much time the client spends on it."},
            {"step": 4, "title": "Follow-Up Is Automatic", "description": "If the client doesn't respond within your timeframe, the generator sends a polite follow-up. No awkward 'just checking in' emails."},
          ],
          "benefits": [
            {"title": "Send Proposals in 10 Minutes, Not 2 Hours", "description": "What used to take a half-day of work now takes ten minutes. You close deals faster because the proposal gets out the door while the conversation is still fresh.", "metric": "80% faster proposal creation"},
            {"title": "Professional Every Time", "description": "Every proposal looks polished and complete. No typos, no missing sections, no inconsistent formatting. Your brand looks sharp.", "metric": "100% brand-consistent proposals"},
            {"title": "Track Engagement and Follow Up", "description": "You know when a client opens your proposal and which sections they spend time on. That tells you what matters to them before the next conversation.", "metric": "Full proposal engagement tracking"},
          ],
          "useCases": [
            {"title": "You're a Marketing Agency", "description": "Every client needs a custom proposal with different services, timelines, and pricing. The generator pulls from your service templates and creates a tailored proposal in minutes. Your team sends more pitches and wins more work."},
            {"title": "You're a Construction Company", "description": "After a site visit, you need to send a detailed quote with materials, labor, timeline, and terms. The proposal generator creates it from your pricing database and sends it the same day."},
            {"title": "You're an IT Services Provider", "description": "Proposals need to include technical specifications, service level agreements, and pricing tiers. The generator handles the complexity so your sales team can focus on selling."},
          ]
        }
      },
      {
        "name": "Pipeline Manager",
        "description": "Tracks your deals, reminds you when to follow up, and keeps your pipeline moving.",
        "capabilities": [
          "Tracks every deal through your sales pipeline",
          "Sends reminders when a deal has gone stale",
          "Updates deal stages based on interactions",
          "Forecasts revenue based on pipeline value",
          "Identifies bottlenecks in your sales process",
        ],
        "documentation": {
          "overview": "Deals don't close themselves — but they can die on the vine if you forget to follow up. A pipeline manager watches every deal in your pipeline, tells you when to take action, and keeps things moving toward closed-won.\n\nIt's like having a sales manager who never forgets a follow-up, never loses track of a deal, and always knows what needs attention right now.\n\nYour pipeline stays healthy, your forecast stays accurate, and you stop losing deals you should have closed.",
          "howItWorks": [
            {"step": 1, "title": "Deals Are Tracked", "description": "Every deal in your pipeline is logged with its stage, value, next step, and last contact date. Nothing lives in your head or in a spreadsheet."},
            {"step": 2, "title": "Stale Deals Get Flagged", "description": "When a deal hasn't moved in a while, the manager flags it and tells you exactly what to do — call them, send an email, schedule a meeting."},
            {"step": 3, "title": "Stages Update Automatically", "description": "When a prospect books a meeting, signs a proposal, or makes a payment, the deal moves to the next stage automatically."},
            {"step": 4, "title": "You Get a Weekly Forecast", "description": "Every week, you see a revenue forecast based on your pipeline. You know what's likely to close, what needs attention, and where the bottlenecks are."},
          ],
          "benefits": [
            {"title": "Never Let a Deal Go Cold", "description": "Stale deals get flagged before they die. You follow up at the right time, every time.", "metric": "35% fewer deals lost to inaction"},
            {"title": "Accurate Revenue Forecasting", "description": "Know what's coming. Your weekly forecast is based on real pipeline data, not guesswork.", "metric": "90% forecast accuracy"},
            {"title": "See Your Bottlenecks", "description": "The manager shows you where deals get stuck. Is it the proposal stage? The demo? You'll know exactly where to improve.", "metric": "Full pipeline visibility"},
          ],
          "useCases": [
            {"title": "You're a B2B Software Company", "description": "Your sales cycle is 60 days with five stages. Deals stall at the demo stage because your sales team forgets to follow up. The pipeline manager flags every stalled deal and sends reminders. Your close rate jumps."},
            {"title": "You're a Mortgage Broker", "description": "You have 30 active loans in progress at various stages — application, processing, underwriting, closing. The pipeline manager tracks every one and tells you which ones need your attention today."},
            {"title": "You Run a Landscaping Business", "description": "You send out 20 quotes a week. Some clients say yes immediately, some need follow-up, and some go quiet. The pipeline manager tracks every quote and reminds you to follow up with the ones that haven't responded."},
          ]
        }
      },
      {
        "name": "Outreach Assistant",
        "description": "Sends cold emails and LinkedIn messages to prospects on your behalf.",
        "capabilities": [
          "Sends personalized cold emails at scale",
          "Follows up automatically based on opens and replies",
          "Personalizes each message with company and contact details",
          "Manages sending limits to protect your sender reputation",
          "Tracks open rates, reply rates, and conversions",
        ],
        "documentation": {
          "overview": "Cold outreach works — but only when it's personal and persistent. Sending 500 generic emails gets you nowhere. Sending 50 personalized emails that follow up at the right time gets meetings.\n\nAn outreach assistant handles the personalization and the persistence. It researches your prospects, writes messages that sound like they came from a real person, and follows up automatically based on how each prospect engages.\n\nYou get the results of a dedicated SDR without the salary.",
          "howItWorks": [
            {"step": 1, "title": "You Define Your Ideal Prospect", "description": "You tell the assistant who you want to reach — industry, company size, job title, location. It builds a targeted list."},
            {"step": 2, "title": "Messages Are Personalized", "description": "Each prospect gets a personalized message. The assistant pulls details about their company, role, and recent news to make it relevant."},
            {"step": 3, "title": "Emails Go Out on Schedule", "description": "Messages are sent at optimal times, respecting daily limits to keep your sender reputation strong."},
            {"step": 4, "title": "Follow-Ups Are Automatic", "description": "If a prospect opens but doesn't reply, a follow-up goes out. If they click a link, you get notified. Every interaction is tracked."},
          ],
          "benefits": [
            {"title": "10x More Personalization Than Manual", "description": "Each message includes details about the prospect's company and role. It reads like it was written just for them — because it was.", "metric": "10x more personalized outreach"},
            {"title": "3x Higher Reply Rates", "description": "Personalized, well-timed messages with smart follow-ups get 3x more replies than generic blasts.", "metric": "3x higher reply rates"},
            {"title": "Protect Your Sender Reputation", "description": "The assistant manages sending volume and follows best practices so your emails land in the inbox, not spam.", "metric": "95% inbox placement rate"},
          ],
          "useCases": [
            {"title": "You're a Recruiting Firm", "description": "You need to reach passive candidates at target companies. The outreach assistant sends personalized LinkedIn messages and emails that feel like they came from a person, not a machine. Candidates respond because the message is relevant."},
            {"title": "You're a SaaS Company Doing Account-Based Marketing", "description": "You've identified 200 target accounts. The outreach assistant sends personalized emails to the right people at each account, follows up based on engagement, and alerts your sales team when someone responds."},
            {"title": "You're a Commercial Real Estate Broker", "description": "You want to reach business owners in specific industries and zip codes. The outreach assistant builds the list, personalizes each message, and follows up until you get a meeting or a 'not interested.'"},
          ]
        }
      },
      {
        "name": "Appointment Setter",
        "description": "Books sales calls and demos for your team by reaching out to qualified prospects.",
        "capabilities": [
          "Contacts prospects via phone, email, or text to book meetings",
          "Qualifies prospects before booking to ensure quality meetings",
          "Books directly into your sales team's calendar",
          "Sends confirmation and reminder messages to reduce no-shows",
          "Reports on conversion rates from contact to booked meeting",
        ],
        "documentation": {
          "overview": "Your sales team should be selling — not spending half their day on the phone trying to book meetings. An appointment setter does the outreach, handles the objections, and books the meeting. Your team just shows up and closes.\n\nIt's like having a full-time SDR who never takes a break, never gets discouraged by rejection, and never stops dialing.\n\nYour sales team's calendar fills up with qualified meetings, and your cost per booked appointment drops dramatically.",
          "howItWorks": [
            {"step": 1, "title": "Prospects Are Identified", "description": "You provide a list of prospects or criteria. The setter researches each one and prioritizes the most likely to convert."},
            {"step": 2, "title": "Outreach Begins", "description": "The setter contacts each prospect via phone, email, or text. They introduce your business, explain the value, and ask for a meeting."},
            {"step": 3, "title": "Objections Are Handled", "description": "If a prospect says 'not interested' or 'send me info,' the setter handles it with your approved responses. Many 'no's become 'yes's."},
            {"step": 4, "title": "Meetings Are Booked", "description": "When a prospect agrees, the setter books the meeting on your sales team's calendar and sends confirmations to both sides."},
          ],
          "benefits": [
            {"title": "Your Sales Team Sells, Not Schedules", "description": "Stop paying $60,000+ for SDRs to make cold calls. The appointment setter books meetings at a fraction of the cost.", "metric": "70% lower cost per booked meeting"},
            {"title": "Fill Your Calendar with Qualified Meetings", "description": "The setter qualifies before booking, so your sales team talks to real prospects — not people who were never going to buy.", "metric": "3x more qualified meetings per week"},
            {"title": "Consistent Outreach, Every Day", "description": "The setter doesn't have bad days, doesn't skip follow-ups, and doesn't forget to call back. Every prospect gets a fair shot.", "metric": "100% of prospects contacted"},
          ],
          "useCases": [
            {"title": "You're a Solar Panel Installer", "description": "You need to book in-home consultations with homeowners. The appointment setter calls through your lead list, explains the savings, and books consultations. Your sales team does the in-home pitch."},
            {"title": "You're a Financial Advisory Firm", "description": "You want to schedule discovery calls with high-net-worth prospects. The appointment setter reaches out, qualifies their interest and investable assets, and books calls with your advisors."},
            {"title": "You Run a B2B Cleaning Service", "description": "You need to book walk-throughs with office managers and facility directors. The appointment setter contacts them, explains your services, and schedules on-site visits for your sales team."},
          ]
        }
      },
      {
        "name": "Lead Qualifier",
        "description": "Sorts your leads by quality so your team talks to the right ones first.",
        "capabilities": [
          "Scores leads based on your ideal customer profile",
          "Asks qualifying questions via phone, text, or form",
          "Routes hot leads to sales immediately",
          "Moves cold leads to a nurture sequence",
          "Updates lead scores based on engagement over time",
        ],
        "documentation": {
          "overview": "Not all leads are created equal. Some are ready to buy today. Some are just browsing. And some were never going to buy at all. Treating them all the same wastes your sales team's time.\n\nA lead qualifier sorts your leads by quality. It asks the right questions, scores each lead, and makes sure your sales team talks to the hottest prospects first. The cooler leads get nurtured until they're ready.\n\nYour sales team closes more deals because they're spending time on leads that actually convert.",
          "howItWorks": [
            {"step": 1, "title": "A Lead Comes In", "description": "A new lead enters your system — from a form, a call, a referral, or a list. The qualifier picks it up immediately."},
            {"step": 2, "title": "Qualifying Questions Are Asked", "description": "The lead is asked a series of questions that determine fit: budget, timeline, authority, need. The exact questions are yours to define."},
            {"step": 3, "title": "The Lead Gets Scored", "description": "Based on the answers, the lead gets a score. Hot leads go straight to your sales team. Warm leads get nurtured. Cold leads get filtered out."},
            {"step": 4, "title": "Scores Update Over Time", "description": "As a lead engages — opens emails, visits your site, responds to messages — their score updates. A cold lead can warm up over time."},
          ],
          "benefits": [
            {"title": "Sales Talks to Buyers, Not Browsers", "description": "Your team spends time on leads that are actually likely to convert. No more 'I'm just looking' calls.", "metric": "2x more time spent on qualified leads"},
            {"title": "Faster Response to Hot Leads", "description": "The hottest leads get routed to sales immediately. Speed wins deals, and your team is talking to them within minutes.", "metric": "5-minute response to hot leads"},
            {"title": "Cold Leads Get Nurtured, Not Forgotten", "description": "Leads that aren't ready today get moved into a nurture sequence. They'll be there when they're ready to buy.", "metric": "Zero leads discarded"},
          ],
          "useCases": [
            {"title": "You're a High-End Remodeling Contractor", "description": "You get leads from your website, but 80% aren't serious or can't afford your work. The lead qualifier asks about budget, timeline, and scope before your sales team ever picks up the phone. Your team only visits homes where the project is a go."},
            {"title": "You're a Private School", "description": "Inquiries come from families who are just curious and families who are ready to enroll. The lead qualifier asks about timeline, grade level, and motivation. Your admissions team focuses on families who are ready to apply."},
            {"title": "You're a Commercial Insurance Broker", "description": "You get leads from your website, referrals, and cold outreach. The lead qualifier scores them by industry, company size, and coverage needs. Your agents spend time on the accounts most likely to close."},
          ]
        }
      },
      {
        "name": "Follow-Up Sequencer",
        "description": "Sends timed follow-up sequences to prospects who aren't ready yet.",
        "capabilities": [
          "Creates multi-step email and text sequences",
          "Sends messages at optimal intervals based on engagement",
          "Personalizes each step with prospect details",
          "Pauses sequences when a prospect replies or books a meeting",
          "Tracks which messages get the best response rates",
        ],
        "documentation": {
          "overview": "Most sales are lost not because the prospect said no, but because nobody followed up. The prospect was interested, just not ready — and then everyone moved on.\n\nA follow-up sequencer keeps the conversation going. It sends a series of helpful, non-pushy messages over days or weeks, staying on the prospect's radar until they're ready to move forward.\n\nYou stay top of mind without being annoying. And when the prospect is ready, you're the first person they think of.",
          "howItWorks": [
            {"step": 1, "title": "A Prospect Enters the Sequence", "description": "After an initial conversation, demo, or proposal, the prospect is added to a follow-up sequence. You choose the sequence that fits."},
            {"step": 2, "title": "Messages Go Out on Schedule", "description": "The sequencer sends emails or texts at the intervals you've set — maybe day 1, day 3, day 7, day 14. Each message provides value, not just 'checking in.'"},
            {"step": 3, "title": "Engagement Is Tracked", "description": "If a prospect opens an email, clicks a link, or replies, you're notified. The sequence can adjust based on their behavior."},
            {"step": 4, "title": "The Sequence Ends or Converts", "description": "When the prospect books a meeting or says they're not interested, the sequence stops. No more messages. No awkwardness."},
          ],
          "benefits": [
            {"title": "3x More Prospects Convert Over Time", "description": "Most prospects don't buy on the first touch. A well-timed sequence keeps you in the conversation until they're ready.", "metric": "3x more conversions from follow-up sequences"},
            {"title": "Zero Manual Follow-Up", "description": "You don't have to remember who to follow up with or when. The sequencer handles it all.", "metric": "100% automated follow-up"},
            {"title": "Learn What Messages Work", "description": "The sequencer tracks open rates and replies for each message. You learn what resonates and improve over time.", "metric": "Full message performance analytics"},
          ],
          "useCases": [
            {"title": "You're a Wedding Photographer", "description": "Couples inquire months before their wedding. They're interested but not ready to commit. A follow-up sequence sends portfolio highlights, pricing info, and testimonials over six weeks. When they're ready to book, you're top of mind."},
            {"title": "You're a SaaS Company", "description": "A prospect signs up for a free trial but doesn't convert. A follow-up sequence sends tips, case studies, and a demo offer over two weeks. Many trial users convert after the third or fourth touch."},
            {"title": "You're a Home Builder", "description": "A family is interested in building but needs to sell their current house first. A follow-up sequence checks in every few weeks with market updates and floor plan options. When their house sells, you're the builder they call."},
          ]
        }
      },
      {
        "name": "CRM Updater",
        "description": "Keeps your CRM current with every interaction logged automatically.",
        "capabilities": [
          "Logs every call, email, and meeting to the right contact record",
          "Updates contact details when new information is available",
          "Creates new contact records from inbound leads",
          "Merges duplicate records to keep your database clean",
          "Syncs data between your CRM and other tools",
        ],
        "documentation": {
          "overview": "Your CRM is only as good as the data in it. But keeping it updated is tedious — after every call, someone has to remember to log it. After every meeting, someone has to update the notes. And usually, they don't.\n\nA CRM updater does it automatically. Every interaction — calls, emails, meetings, form submissions — gets logged to the right contact record without anyone on your team lifting a finger. New contacts are created, duplicates are merged, and your CRM stays clean and current.\n\nYour sales team always has the full picture. No more 'I didn't know they called last week' or 'who was supposed to follow up with them?'",
          "howItWorks": [
            {"step": 1, "title": "An Interaction Happens", "description": "A prospect calls, emails, fills out a form, or attends a meeting. The CRM updater captures the interaction from your connected tools."},
            {"step": 2, "title": "The Right Record Is Found", "description": "The updater matches the interaction to the correct contact in your CRM. If the contact doesn't exist yet, a new record is created."},
            {"step": 3, "title": "Everything Gets Logged", "description": "The interaction is added to the contact's timeline with all the details — date, type, outcome, notes. Your team sees the full history at a glance."},
            {"step": 4, "title": "Data Stays Clean", "description": "Duplicate records are merged, outdated info is updated, and your CRM stays accurate without anyone doing manual data entry."},
          ],
          "benefits": [
            {"title": "Your CRM Is Always Current", "description": "Every interaction gets logged automatically. Your team always has up-to-date information, and nothing falls through the cracks.", "metric": "100% of interactions logged"},
            {"title": "No More Manual Data Entry", "description": "Your sales team spends their time selling, not typing notes into a CRM. The updater handles the admin work.", "metric": "5 hours saved per rep per week"},
            {"title": "Clean, Duplicate-Free Database", "description": "Duplicate records are merged and outdated info is updated. Your CRM stays clean without a dedicated admin.", "metric": "95% reduction in duplicate records"},
          ],
          "useCases": [
            {"title": "You're a Real Estate Broker", "description": "Agents are in the field showing homes, not sitting at their desks updating the CRM. Every call, email, and showing gets logged automatically. When a client calls, any agent can pick up the conversation with full context."},
            {"title": "You Run a Marketing Agency", "description": "Your account managers have calls, emails, and meetings with clients every day. The CRM updater logs every interaction so the full client history is always visible. No more 'what did we discuss last week?'"},
            {"title": "You're a SaaS Company", "description": "Your sales team makes 50 calls a day. Logging each one manually would take an hour. The CRM updater does it automatically, and your pipeline always reflects reality."},
          ]
        }
      },
      {
        "name": "Proposal-to-Contract Pipeline",
        "description": "Generates a proposal, sends it for signature, and creates an invoice once signed — all in one automated flow.",
        "capabilities": [
          "Generates a proposal from your templates with client-specific pricing and scope",
          "Sends the proposal for e-signature and tracks when it's viewed and signed",
          "Automatically generates an invoice when the contract is executed",
          "Stores the signed contract in your document management system",
          "Notifies your team at each stage so they know exactly where every deal stands",
        ],
        "documentation": {
          "overview": "The gap between 'yes, let's do this' and 'here's the signed contract and first invoice' is where deals go to die. Someone has to write the proposal, send it, follow up, get it signed, create the invoice, and file the paperwork. Each step is a chance for delay.\n\nA proposal-to-contract pipeline automates the entire flow. The proposal goes out, gets signed, triggers an invoice, and stores the executed contract — all without manual handoffs. Your team focuses on selling and delivering, not on pushing paperwork through.\n\nDeals close faster. Revenue comes in sooner. And nothing gets lost between 'verbal yes' and 'signed contract.'",
          "howItWorks": [
            {"step": 1, "title": "A Deal Is Ready", "description": "Your sales team marks a deal as 'ready for proposal.' The pipeline pulls the client details, scope, and pricing from your CRM."},
            {"step": 2, "title": "The Proposal Goes Out", "description": "A professional proposal is generated from your template, customized for this client, and sent for e-signature. You can track when it's opened and viewed."},
            {"step": 3, "title": "The Contract Gets Signed", "description": "The client signs electronically. The executed contract is stored automatically, and your team is notified that the deal is official."},
            {"step": 4, "title": "An Invoice Is Created", "description": "The pipeline generates the first invoice based on the signed contract terms and sends it to the client. Your finance team sees the new receivable."},
          ],
          "benefits": [
            {"title": "Close Deals in Days, Not Weeks", "description": "The time between verbal yes and signed contract drops from weeks to days. No more waiting for someone to 'get around to' sending the proposal.", "metric": "60% faster deal closure"},
            {"title": "Zero Manual Handoffs", "description": "The proposal, signature, invoice, and filing all happen in one flow. No one has to remember what step comes next.", "metric": "Fully automated post-sale workflow"},
            {"title": "Revenue Comes In Faster", "description": "Invoices go out the moment the contract is signed, not days later when someone gets around to it. Your cash flow improves.", "metric": "40% faster time to first invoice"},
          ],
          "useCases": [
            {"title": "You're a Marketing Agency", "description": "A client agrees to a $10K/month retainer. The proposal-to-contract pipeline generates the proposal, sends it for signature, and creates the first invoice — all before your salesperson even hangs up the phone."},
            {"title": "You're a Construction Company", "description": "A homeowner approves the remodel scope. The pipeline generates the contract, collects the deposit via e-signature, and creates the invoice. Your project manager gets notified that the deal is ready to start."},
            {"title": "You're an IT Services Provider", "description": "A prospect agrees to a managed services agreement. The pipeline sends the contract for signature, stores the executed copy, and generates the recurring invoice. Your onboarding team gets the green light automatically."},
          ]
        }
      },
    ]
  },
  {
    "department": "Customer Success",
    "icon": "headphones",
    "items": [
      {
        "name": "Review Responder",
        "description": "Responds to online reviews on Google, Yelp, and other platforms.",
        "capabilities": [
          "Monitors review platforms for new reviews about your business",
          "Drafts professional, on-brand responses to positive and negative reviews",
          "Sends responses for your approval or posts them automatically",
          "Tracks response rates and review scores over time",
          "Flags urgent negative reviews that need immediate attention",
        ],
        "documentation": {
          "overview": "Online reviews make or break businesses. A prospective customer with a choice between two similar businesses will pick the one with better reviews — and faster responses. But monitoring and responding to reviews across multiple platforms is time-consuming.\n\nA review responder watches your review platforms and drafts responses to every new review. Positive reviews get a warm thank-you. Negative reviews get a professional, empathetic response that shows you care. You review and approve, or let it post automatically.\n\nEvery review gets a response. Your online reputation improves. And prospective customers see a business that actually cares.",
          "howItWorks": [
            {"step": 1, "title": "A New Review Appears", "description": "Someone leaves a review on Google, Yelp, or another platform you monitor. The responder picks it up immediately."},
            {"step": 2, "title": "A Response Is Drafted", "description": "Based on the review's content and rating, a professional response is drafted. Five-star reviews get gratitude. One-star reviews get empathy and an offer to make it right."},
            {"step": 3, "title": "You Approve or Auto-Post", "description": "You review the drafted response and approve it, or set it to post automatically. Either way, the review gets a response fast."},
            {"step": 4, "title": "Metrics Are Tracked", "description": "You see your response rate, average rating, and review volume over time. You know if your reputation is improving."},
          ],
          "benefits": [
            {"title": "Respond to Every Review", "description": "No review goes unanswered. Whether it's a glowing five-star or a scathing one-star, your customers see that you're paying attention.", "metric": "100% review response rate"},
            {"title": "Turn Negative Reviews Around", "description": "A professional, empathetic response to a bad review can turn an angry customer into a loyal one. And it shows prospective customers how you handle problems.", "metric": "30% of negative reviewers return"},
            {"title": "Save 5+ Hours a Week", "description": "Stop logging into five different platforms to check and respond to reviews. The responder handles it all from one place.", "metric": "5 hours saved per week"},
          ],
          "useCases": [
            {"title": "You Own a Restaurant", "description": "You get 20 reviews a week across Google and Yelp. Some are great, some are unfair, and some mention specific staff members. The review responder drafts appropriate responses for each one, and you approve them in bulk."},
            {"title": "You Run a Dental Practice", "description": "A patient leaves a negative review about wait times. The review responder drafts an empathetic apology and an invitation to discuss it privately. The patient updates their review after your team addresses the issue."},
            {"title": "You're a Real Estate Agent", "description": "Past clients leave reviews that are your best marketing tool. The review responder makes sure every one gets a personal thank-you, and flags the negative ones for your personal attention."},
          ]
        }
      },
      {
        "name": "Customer Check-In",
        "description": "Reaches out to customers at the right time to make sure they're happy.",
        "capabilities": [
          "Sends check-in messages at key points in the customer journey",
          "Asks satisfaction questions via text, email, or phone",
          "Flags unhappy customers for immediate follow-up",
          "Logs feedback and satisfaction scores to each customer record",
          "Tracks retention risk based on engagement and feedback",
        ],
        "documentation": {
          "overview": "Most businesses find out a customer is unhappy when they leave. By then, it's too late. A customer check-in service reaches out proactively — at the right moments — to make sure things are going well.\n\nA week after onboarding, a month after a purchase, at the end of a project — these are the moments when a simple 'how are things going?' can catch a problem before it becomes a cancellation.\n\nYour customers feel cared about. Your retention goes up. And you fix small issues before they become big ones.",
          "howItWorks": [
            {"step": 1, "title": "Check-In Points Are Set", "description": "You define when check-ins should happen — after onboarding, after a purchase, at contract renewal, or at any milestone that matters."},
            {"step": 2, "title": "The Check-In Goes Out", "description": "At the right time, the customer receives a friendly check-in message via their preferred channel. It asks how things are going and if there's anything they need."},
            {"step": 3, "title": "Feedback Is Captured", "description": "The customer responds with their feedback. Satisfied customers get a thank-you. Unhappy customers get flagged for immediate follow-up."},
            {"step": 4, "title": "Issues Get Resolved", "description": "When a customer reports a problem, your team is notified immediately. The issue gets addressed before the customer even thinks about leaving."},
          ],
          "benefits": [
            {"title": "Catch Problems Before Customers Leave", "description": "A simple check-in can reveal a brewing issue weeks before the customer cancels. Early intervention saves accounts.", "metric": "25% improvement in retention"},
            {"title": "Customers Feel Valued", "description": "Reaching out to ask 'how are we doing?' shows customers you care about more than just their money.", "metric": "20% higher customer satisfaction scores"},
            {"title": "Automated, Not Forgotten", "description": "Check-ins happen on schedule, every time. No more 'I meant to follow up with them but forgot.'", "metric": "100% of check-ins delivered on time"},
          ],
          "useCases": [
            {"title": "You Run a Gym", "description": "New members get a check-in at week 1, week 4, and week 12. Members who report low satisfaction get a personal call from a trainer. Your retention improves because people feel seen."},
            {"title": "You're a SaaS Company", "description": "Customers get a check-in 30 days after onboarding. If they report confusion or dissatisfaction, your customer success team reaches out with training resources. Churn drops."},
            {"title": "You Own a Cleaning Service", "description": "After the first clean, the customer gets a satisfaction check-in. If anything was missed, it's corrected before the next visit — not after they've already called a competitor."},
          ]
        }
      },
      {
        "name": "Feedback Collector",
        "description": "Sends surveys and collects customer feedback automatically.",
        "capabilities": [
          "Sends NPS, CSAT, and custom surveys via email or text",
          "Schedules surveys at key moments in the customer journey",
          "Aggregates feedback into dashboards and reports",
          "Flags detractors for immediate follow-up",
          "Tracks satisfaction trends over time",
        ],
        "documentation": {
          "overview": "You can't improve what you don't measure. A feedback collector sends surveys at the right moments, aggregates the results, and shows you exactly where you're winning and where you're falling short.\n\nIt's not about sending more surveys — it's about sending the right surveys at the right time and actually doing something with the results.\n\nYou get a clear picture of customer satisfaction, and your team gets actionable data to improve.",
          "howItWorks": [
            {"step": 1, "title": "Surveys Are Set Up", "description": "You create your surveys — NPS, CSAT, or custom questions. You decide when they go out: after onboarding, after support tickets, at renewal, or at any milestone."},
            {"step": 2, "title": "Surveys Go Out Automatically", "description": "At the right moment, the survey is sent to the customer via email or text. It takes 30 seconds to complete."},
            {"step": 3, "title": "Responses Are Aggregated", "description": "Every response is logged and added to your dashboard. You see your scores, trends, and verbatim comments in one place."},
            {"step": 4, "title": "Detractors Get Followed Up", "description": "Customers who give low scores are flagged immediately. Your team reaches out to understand the issue and make it right."},
          ],
          "benefits": [
            {"title": "Know Your NPS and CSAT in Real Time", "description": "Stop guessing how happy your customers are. See your scores update in real time as responses come in.", "metric": "Real-time satisfaction tracking"},
            {"title": "Turn Detractors into Promoters", "description": "When a detractor is flagged and followed up with quickly, many become your biggest fans. The recovery is more powerful than the complaint.", "metric": "40% of detractors converted to promoters"},
            {"title": "Data-Driven Improvements", "description": "Your feedback data shows you exactly where to improve. No more guessing what customers want.", "metric": "Full feedback analytics dashboard"},
          ],
          "useCases": [
            {"title": "You Run a Hotel", "description": "Guests receive a survey at checkout. Low scores trigger an immediate follow-up from the front desk manager. You track satisfaction by room type, season, and staff member."},
            {"title": "You're an E-Commerce Store", "description": "Customers get a CSAT survey 7 days after delivery. Low scores trigger a customer service outreach. You track satisfaction by product category and shipping method."},
            {"title": "You're a Law Firm", "description": "After a case closes, the client gets a feedback survey. The results help you improve your client experience and identify your best referral sources."},
          ]
        }
      },
      {
        "name": "Churn Preventer",
        "description": "Identifies at-risk customers and triggers retention actions before they leave.",
        "capabilities": [
          "Monitors usage patterns, payment history, and engagement signals",
          "Scores each customer's churn risk on an ongoing basis",
          "Triggers automated retention offers for at-risk accounts",
          "Alerts your team when a high-value customer shows warning signs",
          "Tracks retention campaign effectiveness over time",
        ],
        "documentation": {
          "overview": "Losing a customer is 5x more expensive than keeping one. But most businesses don't see churn coming until it's too late. By the time a customer says 'I want to cancel,' the decision is usually made.\n\nA churn preventer watches for the warning signs — declining usage, late payments, reduced engagement, support complaints — and triggers retention actions before the customer even thinks about leaving.\n\nYou save accounts you would have lost. And your customers feel understood because you reached out at exactly the right time.",
          "howItWorks": [
            {"step": 1, "title": "Behavioral Signals Are Monitored", "description": "The system watches for churn indicators: declining logins, missed payments, reduced order frequency, negative support interactions."},
            {"step": 2, "title": "Churn Risk Is Scored", "description": "Each customer gets a churn risk score based on their behavior. High-risk accounts get flagged for immediate attention."},
            {"step": 3, "title": "Retention Actions Are Triggered", "description": "At-risk customers receive a personalized retention offer — a discount, a check-in call, a feature tutorial — based on their specific risk factors."},
            {"step": 4, "title": "Your Team Follows Up", "description": "For high-value at-risk accounts, your team gets an alert with the customer's history and recommended retention strategy."},
          ],
          "benefits": [
            {"title": "Reduce Churn by 25%", "description": "Catching at-risk customers early and intervening with the right offer dramatically reduces cancellations.", "metric": "25% reduction in churn"},
            {"title": "Save High-Value Accounts", "description": "Your most valuable customers get personal attention when they need it most. A well-timed check-in call can save a $50K account.", "metric": "90% of at-risk high-value accounts retained"},
            {"title": "Understand Why Customers Leave", "description": "The churn risk data shows you the patterns. If customers consistently churn after a specific event, you know where to improve.", "metric": "Full churn analytics and root-cause analysis"},
          ],
          "useCases": [
            {"title": "You're a SaaS Company", "description": "A customer who logged in daily suddenly stops for two weeks. The churn preventer flags them, sends a re-engagement email, and alerts your CS team. A quick check-in call reveals they were stuck on a feature — your team helps, and the account is saved."},
            {"title": "You Run a Subscription Box Service", "description": "A customer skips two months in a row. The churn preventer sends a special offer with their next box. Most customers come back, and the ones who don't were likely leaving anyway."},
            {"title": "You're a Commercial Landscaper", "description": "A long-time client starts requesting fewer services and paying invoices late. The churn preventer alerts your account manager, who schedules a meeting to discuss their changing needs."},
          ]
        }
      },
      {
        "name": "Loyalty Program Manager",
        "description": "Manages your rewards program, tracks points, and sends redemption offers.",
        "capabilities": [
          "Tracks customer points, rewards, and tier status",
          "Sends personalized redemption offers based on purchase history",
          "Manages tier upgrades and milestone rewards",
          "Notifies customers when they're close to earning a reward",
          "Tracks program engagement and redemption rates",
        ],
        "documentation": {
          "overview": "Repeat customers spend 67% more than new ones. A loyalty program rewards the customers who keep coming back — but managing points, tiers, and rewards manually is a nightmare.\n\nA loyalty program manager handles all of it. Points are tracked automatically, tier upgrades happen seamlessly, and customers get personalized offers that make them feel valued.\n\nYour best customers get rewarded. And they keep coming back because they feel appreciated.",
          "howItWorks": [
            {"step": 1, "title": "A Customer Makes a Purchase", "description": "Points are automatically added to the customer's account based on your program rules. The customer sees their updated balance."},
            {"step": 2, "title": "Tier Status Is Evaluated", "description": "The system checks if the customer qualifies for a tier upgrade. If they do, they're notified and given their new benefits."},
            {"step": 3, "title": "Personalized Offers Go Out", "description": "Based on the customer's purchase history and points balance, personalized redemption offers are sent. 'You have 500 points — here's $10 off your next visit.'"},
            {"step": 4, "title": "Engagement Is Tracked", "description": "You see which customers are most engaged, which rewards are most popular, and how the program affects repeat purchase rates."},
          ],
          "benefits": [
            {"title": "Increase Repeat Purchases by 30%", "description": "Customers in a loyalty program come back more often and spend more per visit. The points give them a reason to choose you over a competitor.", "metric": "30% increase in repeat purchases"},
            {"title": "Customers Feel Valued", "description": "Tier upgrades, birthday rewards, and personalized offers make customers feel like VIPs. That emotional connection drives loyalty.", "metric": "40% higher customer lifetime value"},
            {"title": "Zero Manual Tracking", "description": "Points, tiers, and rewards are all managed automatically. No spreadsheets, no manual calculations.", "metric": "Fully automated loyalty management"},
          ],
          "useCases": [
            {"title": "You Own a Coffee Shop", "description": "Customers earn a point per dollar spent. At 100 points, they get a free drink. The loyalty manager tracks everything and sends a 'you're 10 points away from a free latte' nudge that brings them back in."},
            {"title": "You Run an Auto Repair Shop", "description": "Customers earn rewards for every visit. After five oil changes, the sixth is free. The loyalty manager tracks visits and sends the reward offer automatically."},
            {"title": "You're a Beauty Salon", "description": "Clients move through bronze, silver, and gold tiers based on annual spend. Each tier unlocks better perks — priority booking, free add-on services, birthday gifts. The loyalty manager handles all of it."},
          ]
        }
      },
      {
        "name": "Onboarding Assistant",
        "description": "Guides new customers through setup and first use so they get value fast.",
        "capabilities": [
          "Sends a step-by-step onboarding sequence via email or text",
          "Tracks which steps each customer has completed",
          "Follows up with customers who get stuck or go quiet",
          "Collects initial setup information and preferences",
          "Hands off to your team when a customer needs personal help",
        ],
        "documentation": {
          "overview": "The first 30 days determine whether a customer stays or leaves. If they get value quickly, they're yours. If they get confused or frustrated, they're gone. An onboarding assistant makes sure every new customer gets to the 'aha moment' as fast as possible.\n\nIt guides them through setup, checks in at each step, and follows up when they go quiet. Customers who need extra help get routed to your team.\n\nYour activation rate goes up. Your time-to-value goes down. And your customers feel supported from day one.",
          "howItWorks": [
            {"step": 1, "title": "A New Customer Signs Up", "description": "The onboarding sequence begins immediately. The customer receives a welcome message with their first step."},
            {"step": 2, "title": "Steps Are Completed", "description": "The customer works through the onboarding steps at their own pace. The assistant tracks progress and sends the next step when the previous one is done."},
            {"step": 3, "title": "Stuck Customers Get Help", "description": "If a customer hasn't completed a step within your timeframe, the assistant sends a follow-up. If they're still stuck, your team gets alerted."},
            {"step": 4, "title": "Onboarding Is Complete", "description": "When the customer finishes all steps, they get a congratulations message and any next-step recommendations. Your team sees the completed onboarding in their dashboard."},
          ],
          "benefits": [
            {"title": "Faster Time to Value", "description": "Customers who complete onboarding quickly are far more likely to stay. The assistant gets them to the 'aha moment' faster.", "metric": "50% faster time to first value"},
            {"title": "Higher Activation Rates", "description": "Guided onboarding means more customers actually set up and start using your product or service.", "metric": "2x higher activation rate"},
            {"title": "Fewer Support Tickets", "description": "When customers are guided through setup, they don't need to call support as often. Your team's workload drops.", "metric": "30% fewer onboarding-related support tickets"},
          ],
          "useCases": [
            {"title": "You're a SaaS Company", "description": "New users get a 7-step onboarding sequence: create account, connect their data, invite team members, complete first project, etc. Users who don't complete step 3 within 3 days get a personal email from your CS team."},
            {"title": "You Run a Gym", "description": "New members get an onboarding sequence: book orientation, complete fitness assessment, attend first class, meet with a trainer. Members who don't book orientation within a week get a personal call."},
            {"title": "You're a Financial Advisor", "description": "New clients go through an onboarding sequence: complete risk questionnaire, upload documents, review investment plan, fund the account. Each step is tracked and followed up on."},
          ]
        }
      },
      {
        "name": "Customer Health Tracker",
        "description": "Monitors customer engagement and assigns health scores to predict churn risk.",
        "capabilities": [
          "Tracks product usage, login frequency, and feature adoption for each customer",
          "Assigns a health score from 0-100 based on engagement patterns",
          "Alerts your team when a customer's health score drops below your threshold",
          "Identifies expansion opportunities from highly engaged accounts",
          "Generates health score trends and reports by segment, plan, and cohort",
        ],
        "documentation": {
          "overview": "You shouldn't have to wait for a customer to cancel before you realize they were unhappy. A customer health tracker monitors engagement patterns — logins, feature usage, support interactions, payment history — and assigns each customer a health score.\n\nHealthy customers get happier. At-risk customers get attention before they leave. And your team stops being reactive and starts being proactive.\n\nYou always know which customers are thriving and which ones need help.",
          "howItWorks": [
            {"step": 1, "title": "Engagement Data Is Collected", "description": "The tracker pulls data from your product, CRM, and support tools — logins, feature usage, ticket history, payment status, NPS responses."},
            {"step": 2, "title": "Health Scores Are Calculated", "description": "Each customer gets a score from 0-100 based on their engagement. High usage, recent logins, and positive support interactions raise the score. Declining usage and unresolved tickets lower it."},
            {"step": 3, "title": "At-Risk Accounts Get Flagged", "description": "When a customer's score drops below your threshold, your team gets an alert with the reasons why and recommended actions."},
            {"step": 4, "title": "Expansion Opportunities Are Identified", "description": "Highly engaged customers who are using only a portion of your product get flagged as upsell opportunities."},
          ],
          "benefits": [
            {"title": "Predict Churn Before It Happens", "description": "Health scores reveal at-risk customers weeks before they cancel. Your team intervenes early and saves accounts.", "metric": "30% reduction in churn"},
            {"title": "Identify Your Best Expansion Opportunities", "description": "Highly engaged customers on lower plans are your best upsell candidates. The health tracker surfaces them automatically.", "metric": "20% increase in expansion revenue"},
            {"title": "One View of Every Customer's Status", "description": "No more logging into five tools to figure out how a customer is doing. The health score tells you at a glance.", "metric": "Single health score per customer"},
          ],
          "useCases": [
            {"title": "You're a SaaS Company", "description": "A customer who logged in daily last month has only logged in twice this week. Their health score drops from 85 to 45. Your CS team reaches out and discovers they're struggling with a new feature. A quick training call saves the account."},
            {"title": "You Run a Gym", "description": "A member who came 4 times a week for six months suddenly stops coming. Their health score drops and your team sends a personal check-in. It turns out they had a minor injury — you offer a free personal training session when they're ready to come back."},
            {"title": "You Own a Cleaning Service", "description": "A commercial client who always paid on time starts paying late and reducing their service frequency. The health score drops and your account manager schedules a meeting to discuss their changing needs."},
          ]
        }
      },
      {
        "name": "Support Ticket Auto-Resolver",
        "description": "Automatically resolves common support issues using your knowledge base and past resolutions.",
        "capabilities": [
          "Reads incoming support tickets and categorizes the issue",
          "Matches the issue against known solutions from your knowledge base",
          "Sends the customer a resolution immediately for common problems",
          "Escalates complex or unmatched issues to the right team member",
          "Tracks resolution rates and average time to resolve",
        ],
        "documentation": {
          "overview": "Your support team spends half their time answering the same questions over and over. 'How do I reset my password?' 'Where's my invoice?' 'How do I cancel?' These are real questions from real customers, but they don't need a human to answer them.\n\nA support ticket auto-resolver reads every incoming ticket, matches it against your knowledge base of known issues and solutions, and sends the customer an immediate answer. For common problems, the ticket is resolved in seconds — not hours.\n\nYour support team focuses on the complex issues that actually need a human. Your customers get faster answers. And your ticket volume drops because many issues are resolved before they even reach your team.",
          "howItWorks": [
            {"step": 1, "title": "A Support Ticket Arrives", "description": "A customer submits a ticket via email, web form, or chat. The auto-resolver reads and categorizes the issue."},
            {"step": 2, "title": "The Knowledge Base Is Searched", "description": "The resolver matches the issue against known solutions. If there's a match, it sends the customer the answer immediately."},
            {"step": 3, "title": "The Customer Gets a Resolution", "description": "For common issues, the customer receives a clear, step-by-step resolution in seconds. No waiting in a queue."},
            {"step": 4, "title": "Complex Issues Get Escalated", "description": "If the resolver can't match the issue, or if the customer isn't satisfied with the auto-response, the ticket is escalated to the right team member with full context."},
          ],
          "benefits": [
            {"title": "Resolve 40% of Tickets Instantly", "description": "Nearly half of all support tickets are common questions with known answers. The auto-resolver handles these in seconds.", "metric": "40% of tickets auto-resolved"},
            {"title": "Faster Response Times", "description": "Customers with common issues get an answer in seconds, not hours. Their satisfaction goes up and your team's workload goes down.", "metric": "90% faster resolution for common issues"},
            {"title": "Your Team Focuses on Complex Issues", "description": "Your support team stops answering the same questions repeatedly and focuses on the issues that actually need their expertise.", "metric": "50% more time spent on high-value support"},
          ],
          "useCases": [
            {"title": "You're a SaaS Company", description: "Customers submit tickets about password resets, billing questions, and feature how-tos. The auto-resolver matches each one to your knowledge base and sends the answer immediately. Your support team only sees the tickets that need real troubleshooting."},
            {"title": "You Run an E-Commerce Store", "description": "Customers ask about order status, returns, and shipping times. The auto-resolver pulls the order data and sends the answer instantly. Your team only handles the exceptions — damaged items, special requests, and escalations."},
            {"title": "You're a Property Management Company", "description": "Tenants submit maintenance requests, ask about lease terms, and request payment receipts. The auto-resolver handles the routine requests and routes actual maintenance issues to the right vendor."},
          ]
        }
      },
    ]
  },
  {
    "department": "Finance & Billing",
    "icon": "banknote",
    "items": [
      {
        "name": "Invoice Generator",
        "description": "Creates and sends professional invoices on schedule.",
        "capabilities": [
          "Generates invoices from your templates with line items, tax, and totals",
          "Sends invoices via email with payment links",
          "Schedules recurring invoices for retainer and subscription clients",
          "Tracks invoice status: sent, viewed, paid, overdue",
          "Sends automatic payment reminders for overdue invoices",
        ],
        "documentation": {
          "overview": "Invoicing is one of those tasks that should be simple but somehow eats hours every week. You create the invoice, double-check the math, attach the right details, send it, and then chase payment. Multiply that by dozens of clients and it's a part-time job.\n\nAn invoice generator handles all of it. It creates accurate invoices from your templates, sends them on schedule, and follows up when payment is late. Recurring invoices go out automatically. You stop chasing payments and start collecting them.\n\nYour invoices go out on time, every time. And your cash flow improves because nothing falls through the cracks.",
          "howItWorks": [
            {"step": 1, "title": "It's Time to Invoice", "description": "Based on your schedule — weekly, monthly, or at project milestones — the generator creates the invoice from your template with all the right line items."},
            {"step": 2, "title": "The Invoice Goes Out", "description": "The invoice is sent to the client via email with a payment link. They can pay online with one click."},
            {"step": 3, "title": "Payment Is Tracked", "description": "You see when the invoice is viewed and when it's paid. If it goes overdue, automatic reminders go out."},
            {"step": 4, "title": "Recurring Invoices Run Themselves", "description": "For retainer and subscription clients, invoices go out on schedule without you lifting a finger. Set it once and forget it."},
          ],
          "benefits": [
            {"title": "Invoices Go Out on Time, Every Time", "description": "No more 'I forgot to invoice them this month.' The generator handles the schedule so you don't have to.", "metric": "100% of invoices sent on schedule"},
            {"title": "Get Paid Faster", "description": "Invoices with online payment links get paid 3x faster than those that require a check or bank transfer.", "metric": "3x faster payment with online links"},
            {"title": "Stop Chasing Overdue Invoices", "description": "Automatic reminders go out at 7, 14, and 30 days overdue. You don't have to be the bad guy.", "metric": "60% reduction in overdue invoices"},
          ],
          "useCases": [
            {"title": "You're a Freelancer", "description": "You send invoices to 10 clients at the end of each month. The invoice generator creates them all from your timesheet data, sends them out, and follows up on the ones that haven't paid. You stop spending Friday afternoons on billing."},
            {"title": "You Run a Marketing Agency", "description": "You have 15 retainer clients on monthly billing. The generator sends all 15 invoices on the first of the month, tracks which ones are paid, and sends reminders for the ones that aren't."},
            {"title": "You're a Contractor", "description": "You invoice at project milestones. When a milestone is marked complete, the generator creates the invoice and sends it to the homeowner. No more waiting for someone to remember."},
          ]
        }
      },
      {
        "name": "Payment Reminder",
        "description": "Sends polite but firm reminders for overdue payments.",
        "capabilities": [
          "Sends automated reminders at configurable intervals",
          "Escalates tone from friendly to firm as invoices age",
          "Tracks which reminders have been sent and acknowledged",
          "Stops reminding once payment is received",
          "Logs all reminder activity for your records",
        ],
        "documentation": {
          "overview": "Nobody likes chasing money. But overdue invoices are a fact of business, and the longer they go uncollected, the less likely you are to get paid. A payment reminder service handles the awkward part for you.\n\nIt sends a series of increasingly firm reminders on your behalf — friendly at first, more direct as the invoice ages. Once payment comes in, the reminders stop. You get paid without having to make the uncomfortable phone call.\n\nYour receivables shrink. Your team stays focused on productive work. And your clients get a professional, consistent collections process.",
          "howItWorks": [
            {"step": 1, "title": "An Invoice Goes Overdue", "description": "The payment due date passes without payment. The reminder service picks it up and schedules the first reminder."},
            {"step": 2, "title": "Reminders Go Out on Schedule", "description": "A friendly reminder goes out at 7 days overdue. If still unpaid, a firmer one at 14 days. A final notice at 30 days. You set the intervals and the tone."},
            {"step": 3, "title": "Payment Is Received", "description": "When the client pays, the reminders stop immediately. The invoice is marked as paid in your system."},
            {"step": 4, "title": "You See the Full History", "description": "Every reminder sent, every response received, and the final outcome is logged. You have a complete record if you need it."},
          ],
          "benefits": [
            {"title": "Get Paid Without the Awkwardness", "description": "The reminder service handles the uncomfortable part. You don't have to call clients and ask for money.", "metric": "Zero manual collection calls"},
            {"title": "Reduce Overdue Invoices by 60%", "description": "Consistent, timely reminders dramatically reduce the number of invoices that go uncollected.", "metric": "60% reduction in overdue invoices"},
            {"title": "Professional, Consistent Communication", "description": "Every client gets the same professional treatment. No favoritism, no forgotten follow-ups.", "metric": "100% consistent reminder schedule"},
          ],
          "useCases": [
            {"title": "You're a Consultant", "description": "A client hasn't paid their invoice after 30 days. The payment reminder has already sent three increasingly firm notices. Most clients pay after the second one. The ones who don't get escalated to you for a personal call."},
            {"title": "You Run a Small Business", "description": "You have 20 outstanding invoices at any given time. The reminder service tracks all of them and sends the right reminder at the right time. Your bookkeeper focuses on other work."},
            {"title": "You're a Creative Agency", "description": "A client keeps 'forgetting' to pay. The reminder service sends professional, documented reminders that create a paper trail. When you eventually need to escalate, you have everything documented."},
          ]
        }
      },
      {
        "name": "Expense Tracker",
        "description": "Categorizes and tracks your business expenses automatically.",
        "capabilities": [
          "Pulls transactions from your bank account and credit cards",
          "Categorizes each expense based on your rules",
          "Flags unusual or duplicate charges",
          "Generates expense reports by category, time period, or project",
          "Exports data for your accountant at tax time",
        ],
        "documentation": {
          "overview": "Tracking expenses is one of those tasks that's easy to put off and painful to catch up on. Receipts pile up, transactions go uncategorized, and when tax time comes, you're digging through a shoebox.\n\nAn expense tracker automates the whole process. It pulls transactions from your accounts, categorizes them, and generates reports. At tax time, everything is already organized for your accountant.\n\nYou always know where your money is going. And tax season becomes a non-event instead of a nightmare.",
          "howItWorks": [
            {"step": 1, "title": "Transactions Are Imported", "description": "The tracker connects to your bank account and credit cards. Every transaction is imported automatically."},
            {"step": 2, "title": "Expenses Are Categorized", "description": "Each transaction is categorized based on your rules. Office supplies go to 'Supplies.' Gas goes to 'Travel.' You can customize the categories."},
            {"step": 3, "title": "Reports Are Generated", "description": "At any time, you can pull up a report: expenses by category, by month, by project. You always know where your money went."},
            {"step": 4, "title": "Tax-Time Export", "description": "When tax season comes, you export a clean report for your accountant. No shoebox of receipts required."},
          ],
          "benefits": [
            {"title": "Know Where Your Money Goes", "description": "Stop guessing how much you spend on supplies, travel, or software. The tracker shows you exactly where every dollar goes.", "metric": "Full expense visibility by category"},
            {"title": "Tax Season Is Easy", "description": "Your expenses are already categorized and totaled. Your accountant gets a clean report instead of a pile of receipts.", "metric": "80% less time on tax preparation"},
            {"title": "Catch Unusual Charges", "description": "Duplicate charges, unexpected subscriptions, and fraudulent transactions get flagged immediately.", "metric": "100% of unusual charges flagged"},
          ],
          "useCases": [
            {"title": "You're a Freelancer", "description": "You have business expenses across two credit cards and a bank account. The expense tracker pulls them all in, categorizes them, and gives you a quarterly profit-and-loss summary."},
            {"title": "You Run a Small Business", "description": "Your team makes purchases on company cards. The expense tracker categorizes every transaction and flags the ones that need receipts. Your bookkeeper reviews instead of data-enters."},
            {"title": "You're a Contractor", "description": "You need to track expenses by job site. The tracker categorizes expenses by project so you know the true cost of each job."},
          ]
        }
      },
      {
        "name": "Subscription Manager",
        "description": "Manages your clients' subscriptions, renewals, and billing cycles.",
        "capabilities": [
          "Tracks all client subscriptions and their renewal dates",
          "Sends renewal reminders before the billing date",
          "Processes recurring payments automatically",
          "Handles upgrades, downgrades, and cancellations",
          "Flags failed payments and retries them automatically",
        ],
        "documentation": {
          "overview": "If you have subscription or retainer clients, managing their billing is a constant juggle. Renewals come up, cards expire, clients want to upgrade or downgrade, and failed payments slip through the cracks.\n\nA subscription manager handles all of it. It tracks every subscription, processes renewals, handles plan changes, and retries failed payments. You stop losing revenue to expired cards and forgotten renewals.\n\nYour recurring revenue is protected. Your clients stay on their plans. And your billing runs like clockwork.",
          "howItWorks": [
            {"step": 1, "title": "A Renewal Date Approaches", "description": "The manager checks upcoming renewals and sends the client a reminder a few days before their card is charged."},
            {"step": 2, "title": "Payment Is Processed", "description": "On the renewal date, the payment is processed automatically. The client receives a receipt."},
            {"step": 3, "title": "Failed Payments Are Retried", "description": "If a payment fails, the manager retries it on a schedule and notifies the client to update their payment method."},
            {"step": 4, "title": "Plan Changes Are Handled", "description": "When a client upgrades or downgrades, the manager prorates the difference and updates the recurring charge."},
          ],
          "benefits": [
            {"title": "Protect Your Recurring Revenue", "description": "Failed payments get retried, renewals get processed on time, and your revenue stays consistent.", "metric": "95% renewal success rate"},
            {"title": "Reduce Involuntary Churn", "description": "Most subscription cancellations are involuntary — the card expired or was declined. The manager catches these before the client is lost.", "metric": "50% reduction in involuntary churn"},
            {"title": "Plan Changes Are Seamless", "description": "Upgrades and downgrades are prorated and processed automatically. No manual calculations, no billing errors.", "metric": "Fully automated plan management"},
          ],
          "useCases": [
            {"title": "You're a SaaS Company", "description": "You have 500 subscribers on monthly and annual plans. The subscription manager processes all renewals, retries failed payments, and handles upgrades. Your MRR stays predictable."},
            {"title": "You Run a Marketing Agency", "description": "Your retainer clients are on monthly billing. The subscription manager sends renewal reminders, processes payments, and flags the ones whose cards are about to expire."},
            {"title": "You Own a Gym", "description": "Members are on monthly memberships. The subscription manager processes payments, retries failed cards, and sends dunning emails. Your membership revenue stays steady."},
          ]
        }
      },
      {
        "name": "Tax Document Collector",
        "description": "Gathers and organizes your tax documents throughout the year.",
        "capabilities": [
          "Collects receipts, invoices, and statements from email and cloud storage",
          "Organizes documents by tax category and quarter",
          "Flags missing documents before tax deadlines",
          "Generates a year-end tax package for your accountant",
          "Stores everything securely for the required retention period",
        ],
        "documentation": {
          "overview": "Tax season is painful because the documents are scattered everywhere — in your email, in your cloud storage, in your accounting software, in a shoebox. Gathering them all takes days.\n\nA tax document collector does it throughout the year. It pulls receipts, invoices, and statements from your email and cloud storage, organizes them by tax category, and builds your tax package as you go.\n\nWhen tax time comes, everything is already organized. Your accountant gets a complete package, and you stop paying them to sort your paperwork.",
          "howItWorks": [
            {"step": 1, "title": "Documents Are Collected", "description": "The collector scans your email and cloud storage for tax-relevant documents — receipts, invoices, bank statements, 1099s."},
            {"step": 2, "title": "Everything Gets Organized", "description": "Documents are sorted by tax category and quarter. Business meals go in one folder, travel in another, office supplies in a third."},
            {"step": 3, "title": "Missing Documents Are Flagged", "description": "If the collector notices a missing document — like a 1099 you should have received — it flags it so you can follow up."},
            {"step": 4, "title": "Your Tax Package Is Ready", "description": "At tax time, you download a complete, organized package and send it to your accountant. Done."},
          ],
          "benefits": [
            {"title": "Tax Prep Takes Minutes, Not Days", "description": "Your documents are already collected and organized. No more spending a weekend gathering receipts.", "metric": "90% less time on tax prep"},
            {"title": "Never Miss a Deduction", "description": "When every receipt is captured and categorized, you don't miss deductions. Your tax bill goes down.", "metric": "100% of deductible expenses captured"},
            {"title": "Audit-Ready Documentation", "description": "If you're ever audited, every document is organized and accessible. No panic, no scrambling.", "metric": "Full audit-ready documentation"},
          ],
          "useCases": [
            {"title": "You're a Freelancer", "description": "You get 1099s from five different clients, have business expenses across three accounts, and get receipts via email. The tax document collector gathers everything and organizes it by quarter."},
            {"title": "You Run a Small Business", "description": "Your business has payroll receipts, vendor invoices, equipment purchases, and mileage logs. The collector organizes all of it so your accountant can file without asking for anything."},
            {"title": "You're a Real Estate Agent", "description": "Your deductions include mileage, home office, marketing, and continuing education. The collector categorizes every expense so you maximize your deductions."},
          ]
        }
      },
      {
        "name": "Financial Report Generator",
        "description": "Creates profit-and-loss statements, balance sheets, and cash flow reports.",
        "capabilities": [
          "Pulls data from your accounting software and bank accounts",
          "Generates P&L, balance sheet, and cash flow statements",
          "Compares performance across periods — month over month, year over year",
          "Highlights trends, anomalies, and areas of concern",
          "Exports reports in PDF or spreadsheet format",
        ],
        "documentation": {
          "overview": "You can't manage what you can't see. A financial report generator pulls data from your accounting systems and creates clear, accurate financial reports — without you or your bookkeeper spending hours in spreadsheets.\n\nYou see your profit and loss, your balance sheet, and your cash flow in real time. You compare performance across periods. And you spot trends and problems before they become crises.\n\nFinancial clarity leads to better decisions. And better decisions lead to a healthier business.",
          "howItWorks": [
            {"step": 1, "title": "Data Is Pulled", "description": "The generator connects to your accounting software and bank accounts. All your financial data is imported."},
            {"step": 2, "title": "Reports Are Generated", "description": "P&L, balance sheet, and cash flow statements are created automatically. You can generate them for any time period."},
            {"step": 3, "title": "Trends Are Highlighted", "description": "The generator compares your current performance to previous periods. Revenue up? Expenses trending higher? You see it immediately."},
            {"step": 4, "title": "Reports Are Exported", "description": "Export your reports as PDFs or spreadsheets for your accountant, your bank, or your own records."},
          ],
          "benefits": [
            {"title": "Real-Time Financial Visibility", "description": "Know your financial position at any moment. No more waiting for your bookkeeper to produce a report.", "metric": "Real-time financial dashboards"},
            {"title": "Spot Problems Early", "description": "Trending reports show you when expenses are creeping up or revenue is declining — before it's a crisis.", "metric": "Early warning on financial trends"},
            {"title": "Save on Bookkeeping Costs", "description": "Your bookkeeper spends less time creating reports and more time on analysis. Or you may not need a bookkeeper at all.", "metric": "50% less bookkeeping time on reports"},
          ],
          "useCases": [
            {"title": "You Run a Retail Store", "description": "You want to see your P&L by month, compare this year to last year, and understand your cash flow. The financial report generator creates all three reports and highlights that your cost of goods sold is trending up."},
            {"title": "You're a Consultant", "description": "You need a simple P&L for your accountant at tax time. The generator creates it from your bank transactions and categorizes everything correctly."},
            {"title": "You Own a Restaurant", "description": "You need to track food costs, labor costs, and revenue by week. The generator creates weekly P&Ls and shows you when your food cost percentage exceeds your target."},
          ]
        }
      },
      {
        "name": "Budget Tracker",
        "description": "Monitors budgets vs. actuals and flags overspending before it becomes a problem.",
        "capabilities": [
          "Tracks actual spending against budget by category, department, and project",
          "Alerts you when spending is on track to exceed budget",
          "Generates budget vs. actual reports for any time period",
          "Forecasts year-end spending based on current run rates",
          "Identifies categories with the highest variance from budget",
        ],
        "documentation": {
          "overview": "A budget is only useful if you're tracking against it. Most businesses set a budget at the start of the year and don't look at it again until they've overspent. A budget tracker monitors your actual spending against your budget in real time and alerts you when things are heading off track.\n\nYou catch overspending early. You make informed decisions about where to allocate resources. And you end the year knowing exactly where your money went.\n\nBudgets become a management tool instead of a forgotten spreadsheet.",
          "howItWorks": [
            {"step": 1, "title": "Budgets Are Set", "description": "You define your budget by category, department, or project. The tracker uses these as its baseline."},
            {"step": 2, "title": "Spending Is Monitored", "description": "Every expense is categorized and compared against the budget. The tracker updates in real time."},
            {"step": 3, "title": "Alerts Go Out", "description": "When a category is on track to exceed budget, you get an alert with the details and the forecast."},
            {"step": 4, "title": "Reports Are Generated", "description": "Budget vs. actual reports are generated for any time period. You see exactly where you're over and under."},
          ],
          "benefits": [
            {"title": "Catch Overspending Early", "description": "Don't wait until the end of the quarter to find out you're over budget. The tracker alerts you weeks in advance.", "metric": "Early warning on 90% of budget overruns"},
            {"title": "Make Better Resource Allocation Decisions", "description": "When you can see where money is actually going, you make smarter decisions about where to invest and where to cut.", "metric": "Data-driven budget decisions"},
            {"title": "Year-End Forecasting", "description": "Based on current run rates, the tracker forecasts your year-end spending. You can adjust before it's too late.", "metric": "95% accurate year-end forecast"},
          ],
          "useCases": [
            {"title": "You Run a Marketing Agency", "description": "Each client engagement has a budget. The budget tracker monitors spending against each engagement and alerts you when a project is on track to go over budget. You can reallocate resources before it's too late."},
            {"title": "You Own a Restaurant", "description": "Food costs, labor, and overhead each have monthly budgets. The budget tracker shows you that food costs are trending 8% over budget this month, so you adjust your menu pricing before it hits your bottom line."},
            {"title": "You're a Construction Company", "description": "Every job has a budget for materials, labor, and subcontractors. The budget tracker monitors each job and flags when material costs are running higher than estimated."},
          ]
        }
      },
      {
        "name": "Payment Processor",
        "description": "Processes customer payments, handles refunds, and manages subscription billing.",
        "capabilities": [
          "Accepts payments via credit card, ACH, and digital wallets",
          "Processes full and partial refunds with automatic reconciliation",
          "Manages subscription billing cycles, prorations, and dunning",
          "Detects and prevents fraudulent transactions",
          "Settles funds to your bank account on your preferred schedule",
        ],
        "documentation": {
          "overview": "Getting paid is the most important part of business — and the most fraught. Cards get declined, refunds need processing, subscriptions need managing, and fraud is a constant threat. Handling all of this manually is error-prone and slow.\n\nA payment processor handles the entire payment lifecycle. It accepts payments across multiple methods, processes refunds, manages subscription billing, and detects fraud. Everything is reconciled automatically so your books stay clean.\n\nYour customers pay easily. Your refunds are handled professionally. And your subscription revenue runs on autopilot.",
          "howItWorks": [
            {"step": 1, "title": "A Customer Pays", "description": "The customer submits payment via credit card, ACH, or digital wallet. The processor validates the payment and checks for fraud."},
            {"step": 2, "title": "Funds Are Captured", "description": "The payment is authorized and captured. Funds are settled to your bank account on your preferred schedule — daily, weekly, or monthly."},
            {"step": 3, "title": "Refunds Are Processed", "description": "When a refund is requested, the processor handles it automatically. The refund is reconciled against the original transaction so your books stay accurate."},
            {"step": 4, "title": "Subscriptions Are Managed", "description": "Recurring billing runs on schedule. Failed payments trigger dunning emails. Plan changes are prorated automatically."},
          ],
          "benefits": [
            {"title": "Accept Every Payment Method", "description": "Your customers can pay how they want — credit card, bank transfer, or digital wallet. More payment options means more completed transactions.", "metric": "99.5% payment acceptance rate"},
            {"title": "Refunds in Seconds, Not Days", "description": "Refunds are processed immediately and reconciled automatically. Your customers get their money back fast, and your books stay clean.", "metric": "Same-day refund processing"},
            {"title": "Fraud Protection Built In", "description": "Every transaction is screened for fraud. Suspicious payments are flagged before they're charged, protecting you and your customers.", "metric": "99% fraud detection rate"},
          ],
          "useCases": [
            {"title": "You Run an E-Commerce Store", "description": "Customers pay with credit cards, Apple Pay, and PayPal. The processor handles all three, settles funds daily, and flags a suspicious order from a new customer using a stolen card."},
            {"title": "You're a SaaS Company", "description": "Subscribers are billed monthly on their signup date. The processor handles all recurring billing, retries failed cards, and processes a prorated refund when a customer downgrades mid-cycle."},
            {"title": "You Own a Med Spa", "description": "Patients pay for treatments with credit cards and HSA cards. The processor accepts both, and when a patient disputes a charge, the processor handles the reconciliation automatically."},
          ]
        }
      },
      {
        "name": "Payroll Automation",
        "description": "Calculates pay, withholds taxes, and processes direct deposits for your team.",
        "capabilities": [
          "Calculates gross pay, tax withholdings, and net pay for each employee",
          "Processes direct deposits on payday automatically",
          "Files and pays payroll taxes to federal and state agencies",
          "Generates pay stubs and year-end W-2s",
          "Handles overtime, bonuses, and deductions according to your policies",
        ],
        "documentation": {
          "overview": "Payroll is one of the most complex and error-prone tasks in business. Get the withholdings wrong and you owe the IRS. Miss a tax filing deadline and you pay penalties. Process a direct deposit to the wrong account and you have a very unhappy employee.\n\nPayroll automation handles all of it. It calculates every employee's pay, withholds the right taxes, deposits funds to the right accounts, and files the required tax forms. Payroll runs itself, and you never worry about a missed deadline or a wrong calculation.\n\nYour employees get paid on time, every time. Your taxes are filed correctly. And you stop spending hours on payroll every pay period.",
          "howItWorks": [
            {"step": 1, "title": "Hours and Data Are Collected", "description": "Employee hours, salary data, and any adjustments (bonuses, overtime, deductions) are gathered from your time tracking and HR systems."},
            {"step": 2, "title": "Pay Is Calculated", "description": "The system calculates gross pay, federal and state tax withholdings, Social Security, Medicare, and any other deductions. Net pay is determined for each employee."},
            {"step": 3, "title": "Direct Deposits Go Out", "description": "On payday, net pay is deposited directly into each employee's bank account. Pay stubs are generated and made available to employees."},
            {"step": 4, "title": "Taxes Are Filed", "description": "Payroll taxes are calculated, filed, and paid to the appropriate federal and state agencies on schedule. Year-end W-2s are generated automatically."},
          ],
          "benefits": [
            {"title": "Zero Payroll Errors", "description": "Automated calculations eliminate human error. Every withholding is correct, every deposit is accurate, and every tax filing is on time.", "metric": "99.9% payroll accuracy"},
            {"title": "Save 10+ Hours Per Pay Period", "description": "What used to take a full day of work now runs automatically. Your HR team focuses on people, not paperwork.", "metric": "10 hours saved per pay period"},
            {"title": "Never Miss a Tax Deadline", "description": "Payroll tax filings and payments happen automatically. No penalties, no late fees, no stress.", "metric": "100% on-time tax filings"},
          ],
          "useCases": [
            {"title": "You Run a Restaurant", "description": "Your staff includes salaried managers, hourly servers, and tipped employees. Payroll automation handles the different pay structures, tip reporting, and tax withholdings for each employee type."},
            {"title": "You're a Growing Startup", "description": "You've gone from 5 to 30 employees in a year. Payroll automation scales with you — new hires are added, direct deposits are set up, and tax filings adjust automatically."},
            {"title": "You Own a Construction Company", "description": "Your crew works different hours each week across multiple job sites. Payroll automation calculates overtime, handles union deductions, and processes certified payroll reports."},
          ]
        }
      },
      {
        "name": "Financial Dashboard",
        "description": "Shows real-time revenue, expenses, and cash flow in one unified view.",
        "capabilities": [
          "Pulls live data from your bank accounts, payment processor, and accounting software",
          "Displays revenue, expenses, profit margins, and cash flow in real time",
          "Compares current performance to previous periods and budgets",
          "Alerts you when key metrics cross thresholds you define",
          "Generates shareable reports for stakeholders and investors",
        ],
        "documentation": {
          "overview": "You check your bank balance and hope for the best. But a bank balance doesn't tell you if you're profitable, if your expenses are trending up, or if you'll have enough cash next month. You need a real-time financial picture.\n\nA financial dashboard pulls data from all your financial systems — bank accounts, payment processor, accounting software — and shows you the numbers that matter in real time. Revenue, expenses, profit margins, cash flow — all in one view.\n\nYou make better decisions because you have better information. And you spot problems while they're still small enough to fix.",
          "howItWorks": [
            {"step": 1, "title": "Data Sources Are Connected", "description": "The dashboard connects to your bank accounts, payment processor, and accounting software. All financial data flows in automatically."},
            {"step": 2, "title": "Metrics Are Calculated", "description": "Revenue, expenses, gross margin, net profit, and cash flow are calculated in real time. You see your current financial position at a glance."},
            {"step": 3, "title": "Trends and Alerts Are Set", "description": "You define thresholds: alert me if monthly expenses exceed $50K, or if cash balance drops below $10K. The dashboard monitors and alerts you."},
            {"step": 4, "title": "Reports Are Shared", "description": "Generate shareable reports for your partners, investors, or board. Everyone sees the same numbers, updated in real time."},
          ],
          "benefits": [
            {"title": "See Your Financial Position Instantly", "description": "No more logging into three different systems to figure out where you stand. Everything is in one dashboard, updated in real time.", "metric": "Single source of financial truth"},
            {"title": "Make Better Decisions, Faster", "description": "When you can see revenue, expenses, and cash flow in real time, you make smarter decisions about hiring, spending, and investing.", "metric": "Data-driven financial decisions"},
            {"title": "Catch Problems Before They're Crises", "description": "Threshold alerts tell you when expenses are trending up or cash is running low — before it's an emergency.", "metric": "Early warning on financial issues"},
          ],
          "useCases": [
            {"title": "You Run a Growing Agency", "description": "You need to know if you can afford to hire two more people. The financial dashboard shows your revenue trend, current expenses, and cash runway. You can see that you're in a safe position to hire."},
            {"title": "You Own a Retail Store", "description": "You want to track daily revenue, cost of goods sold, and profit margin in real time. The dashboard shows you that your margin dropped this month because a key supplier raised prices."},
            {"title": "You're a SaaS Founder", "description": "Your investors want to see MRR, churn rate, and burn rate. The financial dashboard generates a shareable report with all key metrics, updated in real time."},
          ]
        }
      },
    ]
  },
  {
    "department": "Operations",
    "icon": "settings",
    "items": [
      {
        "name": "Data Entry Automator",
        "description": "Transfers data between systems without manual copy-paste.",
        "capabilities": [
          "Moves data between your CRM, spreadsheets, and other tools",
          "Validates data before entry to prevent errors",
          "Runs on a schedule or triggers when new data arrives",
          "Logs every transfer for audit purposes",
          "Flags mismatches and duplicates for review",
        ],
        "documentation": {
          "overview": "Data entry is the most tedious, error-prone task in business. Someone has to copy information from one system to another — from a form to a spreadsheet, from a spreadsheet to a CRM, from an email to a database. It's boring, it's slow, and people make mistakes.\n\nA data entry automator does it all without human hands. It moves data between your systems, validates it before entry, and logs every transfer. When something doesn't match, it flags it for review instead of silently creating errors.\n\nYour data is accurate. Your team stops doing mind-numbing copy-paste. And your systems stay in sync without anyone lifting a finger.",
          "howItWorks": [
            {"step": 1, "title": "Data Arrives", "description": "A new lead fills out a form, an email comes in, or a spreadsheet is updated. The automator detects the new data."},
            {"step": 2, "title": "Data Is Validated", "description": "The automator checks the data for errors — missing fields, wrong formats, duplicates. If something's off, it flags it."},
            {"step": 3, "title": "Data Is Transferred", "description": "Clean data is entered into the right system — your CRM, your spreadsheet, your database. Every transfer is logged."},
            {"step": 4, "title": "You See the Results", "description": "You get a summary of what was transferred, what was flagged, and what needs your attention. Everything is auditable."},
          ],
          "benefits": [
            {"title": "Eliminate Manual Data Entry", "description": "Your team stops copying and pasting between systems. The automator handles it all, error-free.", "metric": "100% reduction in manual data entry"},
            {"title": "Data Is Accurate Across All Systems", "description": "When data is entered once and synced everywhere, there are no discrepancies between your CRM, spreadsheets, and other tools.", "metric": "Zero data mismatches between systems"},
            {"title": "Full Audit Trail", "description": "Every transfer is logged. If you need to trace where data came from or when it was entered, the record is there.", "metric": "Complete data transfer audit trail"},
          ],
          "useCases": [
            {"title": "You Run a Real Estate Brokerage", "description": "New leads from your website need to go into your CRM, your email marketing tool, and a spreadsheet for your agents. The data entry automator transfers all three, validates the email addresses, and flags duplicates."},
            {"title": "You're a Recruiter", "description": "Candidate information comes in from job boards, LinkedIn, and email. The automator enters each candidate into your ATS, checks for duplicates, and flags incomplete applications."},
            {"title": "You Own a Medical Practice", "description": "Patient intake forms need to be entered into your EMR, your billing system, and your scheduling tool. The automator handles all three, reducing front desk workload."},
          ]
        }
      },
      {
        "name": "File Organizer",
        "description": "Sorts and organizes your files into the right folders automatically.",
        "capabilities": [
          "Watches your cloud storage for new files",
          "Sorts files by type, date, client, or project based on your rules",
          "Renames files to match your naming conventions",
          "Archives old files based on your retention policy",
          "Flags files that don't match any rule for manual sorting",
        ],
        "documentation": {
          "overview": "Your cloud storage is a mess. Files are in the wrong folders, named inconsistently, and mixed in with outdated versions. Finding what you need takes longer than it should, and sometimes you can't find it at all.\n\nA file organizer watches your cloud storage and sorts everything according to your rules. New files get renamed, moved to the right folder, and archived when they're old enough. Your storage stays clean without anyone spending Friday afternoon organizing.\n\nYou find what you need in seconds. Your team follows consistent naming conventions. And your storage doesn't become a digital junk drawer.",
          "howItWorks": [
            {"step": 1, "title": "A New File Appears", "description": "Someone uploads a file to your cloud storage — a contract, an invoice, a design file, a report."},
            {"step": 2, "title": "Rules Are Applied", "description": "The organizer checks the file against your sorting rules. Contracts go to the Contracts folder. Invoices go to the Invoices folder. Each file gets renamed to match your convention."},
            {"step": 3, "title": "The File Is Placed", "description": "The file is moved to the right folder with the right name. If it doesn't match any rule, it goes to a 'Needs Sorting' folder for manual review."},
            {"step": 4, "title": "Old Files Are Archived", "description": "Files older than your retention period are moved to an archive folder. Your active storage stays clean."},
          ],
          "benefits": [
            {"title": "Find Any File in Seconds", "description": "When everything is in the right place with the right name, finding what you need takes a search, not a scavenger hunt.", "metric": "90% faster file retrieval"},
            {"title": "Consistent Naming Across Your Team", "description": "Everyone's files follow the same convention. No more 'final_v3_REAL_final.pdf.'", "metric": "100% naming convention compliance"},
            {"title": "Your Storage Stays Clean", "description": "Old files get archived, misfiled files get corrected, and nothing accumulates in the wrong place.", "metric": "Zero file clutter"},
          ],
          "useCases": [
            {"title": "You Run a Law Firm", "description": "Every document needs to be filed by client, matter, and document type. The file organizer sorts incoming documents into the correct client-matter folder and renames them to your firm's convention."},
            {"title": "You're a Marketing Agency", "description": "Design files, briefs, and approvals come in from multiple team members. The file organizer sorts them by client and project, so everyone knows where to find the latest version."},
            {"title": "You're an Accountant", "description": "Tax documents come in from clients throughout the year. The file organizer sorts them by client, year, and document type. At tax time, everything is already in order."},
          ]
        }
      },
      {
        "name": "Report Scheduler",
        "description": "Generates and sends reports on a schedule — daily, weekly, or monthly.",
        "capabilities": [
          "Creates reports from your data sources on a schedule",
          "Sends reports to stakeholders via email",
          "Customizes report content for different audiences",
          "Stores historical reports for comparison",
          "Flags anomalies in the data before sending",
        ],
        "documentation": {
          "overview": "Reports are important — but creating them is tedious. Someone has to pull the data, format the report, and send it to the right people. And if that person is busy or out sick, the report doesn't go out.\n\nA report scheduler automates the whole process. It pulls data from your systems, generates the report, and sends it to the right people on schedule. Different audiences get different versions. Anomalies get flagged before the report goes out.\n\nYour stakeholders get the information they need, on time, every time. And your team stops spending hours every week building reports by hand.",
          "howItWorks": [
            {"step": 1, "title": "A Report Is Configured", "description": "You define what data the report should include, how it should be formatted, and who should receive it."},
            {"step": 2, "title": "The Schedule Is Set", "description": "Daily, weekly, monthly — you set the frequency. The scheduler handles the rest."},
            {"step": 3, "title": "The Report Is Generated and Sent", "description": "At the scheduled time, the report is generated from your current data and sent to each recipient. Different versions go to different audiences."},
            {"step": 4, "title": "Anomalies Are Flagged", "description": "If the data looks unusual — a sudden spike or drop — the report includes a flag so stakeholders know to look closer."},
          ],
          "benefits": [
            {"title": "Reports Go Out on Time, Every Time", "description": "No more missed reports because someone was busy or on vacation. The scheduler doesn't take days off.", "metric": "100% on-time report delivery"},
            {"title": "Different Audiences Get Different Reports", "description": "Your CEO gets the high-level summary. Your operations manager gets the detailed breakdown. One data source, multiple reports.", "metric": "Customized reports per audience"},
            {"title": "Anomalies Get Caught Early", "description": "When the data looks off, the report flags it. Stakeholders see the issue before it becomes a crisis.", "metric": "100% of data anomalies flagged"},
          ],
          "useCases": [
            {"title": "You Run a Franchise", "description": "Each franchisee needs a weekly performance report. The report scheduler generates 20 customized reports — one per location — and sends them every Monday morning."},
            {"title": "You're a SaaS Company", "description": "Your leadership team needs a weekly metrics dashboard: MRR, churn, activation rate. The report scheduler generates it from your product data and sends it every Monday at 8am."},
            {"title": "You Own a Manufacturing Business", "description": "Production reports need to go to the plant manager daily and to the executive team weekly. The scheduler generates both versions from the same data."},
          ]
        }
      },
      {
        "name": "Task Automator",
        "description": "Automates repetitive tasks like follow-ups, reminders, and status updates.",
        "capabilities": [
          "Creates task workflows with triggers and actions",
          "Sends follow-up messages when tasks are overdue",
          "Updates project status based on completed tasks",
          "Assigns tasks to team members based on rules",
          "Logs all automated actions for transparency",
        ],
        "documentation": {
          "overview": "Your team spends a surprising amount of time on tasks that could be automated: sending follow-up emails, updating project statuses, assigning work, assigning reminders. These tasks are important, but they don't require human judgment.\n\nA task automator handles all of it. You define the rules — 'when a project reaches this stage, assign it to this person and send this message' — and the automator executes them. Your team focuses on the work that needs human creativity and judgment.\n\nTasks get done on time. Follow-ups happen automatically. And your team spends their energy on work that actually matters.",
          "howItWorks": [
            {"step": 1, "title": "A Trigger Fires", "description": "Something happens — a project reaches a new stage, a task is completed, a deadline approaches. The automator detects the trigger."},
            {"step": 2, "title": "Actions Are Executed", "description": "Based on your rules, the automator takes action: assigns a task, sends a message, updates a status. Everything happens instantly."},
            {"step": 3, "title": "Your Team Is Notified", "description": "The right team members are notified of new tasks and status updates. Nothing gets lost or forgotten."},
            {"step": 4, "title": "Everything Is Logged", "description": "Every automated action is logged. You can see exactly what happened, when, and why."},
          ],
          "benefits": [
            {"title": "Tasks Get Done Without Being Remembered", "description": "The automator doesn't forget, doesn't get distracted, and doesn't take days off. Every trigger gets a response.", "metric": "100% of triggers actioned"},
            {"title": "Your Team Focuses on High-Value Work", "description": "Stop wasting skilled employees' time on repetitive tasks. The automator handles the routine; your team handles the important.", "metric": "20% more time on high-value work"},
            {"title": "Full Transparency", "description": "Every automated action is logged. You always know what happened and why.", "metric": "Complete automation audit trail"},
          ],
          "useCases": [
            {"title": "You Run a Marketing Agency", "description": "When a client approves a campaign, the task automator assigns the work to the creative team, sets the deadlines, and sends the client a confirmation. No project manager needed to kick off the work."},
            {"title": "You're a Law Firm", "description": "When a case reaches the discovery phase, the automator assigns the discovery tasks to the paralegal, sets reminder deadlines, and notifies the attorney. Nothing falls through the cracks."},
            {"title": "You Own a Construction Company", "description": "When a building permit is approved, the automator schedules the inspection, assigns the site supervisor, and updates the project timeline. The project keeps moving without manual coordination."},
          ]
        }
      },
      {
        "name": "Database Updater",
        "description": "Keeps your databases and spreadsheets current with automatic updates.",
        "capabilities": [
          "Syncs data between your databases, spreadsheets, and other tools",
          "Runs updates on a schedule or when triggered by new data",
          "Validates data before updating to prevent errors",
          "Creates backup snapshots before major updates",
          "Logs every change for audit purposes",
        ],
        "documentation": {
          "overview": "Your data lives in multiple places — a CRM, a spreadsheet, a project management tool, a database. Keeping them all in sync is a constant battle. Someone has to remember to update each one, and usually, they don't.\n\nA database updater keeps everything in sync automatically. When data changes in one system, it propagates to all the others. It validates before updating, backs up before major changes, and logs everything.\n\nYour data is consistent across all systems. And you stop discovering that your spreadsheet hasn't been updated in three months.",
          "howItWorks": [
            {"step": 1, "title": "Data Changes", "description": "A record is updated in one of your systems — a new client is added, a project status changes, a payment is recorded."},
            {"step": 2, "title": "The Change Is Detected", "description": "The updater detects the change and identifies which other systems need to be updated."},
            {"step": 3, "title": "Updates Are Pushed", "description": "The change is pushed to all connected systems. Data is validated before each update to prevent errors."},
            {"step": 4, "title": "Changes Are Logged", "description": "Every update is logged with a timestamp and the data that changed. You have a complete audit trail."},
          ],
          "benefits": [
            {"title": "Consistent Data Across All Systems", "description": "When your CRM says one thing and your spreadsheet says another, decisions get made on bad data. The updater keeps everything in sync.", "metric": "100% data consistency across systems"},
            {"title": "No More Manual Updates", "description": "Stop paying someone to copy data from one system to another. The updater handles it automatically.", "metric": "Zero manual data syncing"},
            {"title": "Full Change History", "description": "Every update is logged. If something goes wrong, you can trace exactly what changed and when.", "metric": "Complete change audit trail"},
          ],
          "useCases": [
            {"title": "You Run a Nonprofit", "description": "Donor information lives in your CRM, your email tool, and your accounting software. When a donor updates their address, the database updater syncs it across all three systems."},
            {"title": "You're a Manufacturer", "description": "Inventory levels need to be synced between your warehouse management system, your ERP, and your e-commerce store. The database updater keeps all three in sync in real time."},
            {"title": "You're a Property Manager", "description": "Lease information needs to be consistent across your property management software, your accounting system, and your tenant portal. The updater handles it."},
          ]
        }
      },
      {
        "name": "Vendor Manager",
        "description": "Tracks vendor performance, manages contracts, and handles renewals and payments.",
        "capabilities": [
          "Maintains a centralized vendor database with contracts, contacts, and performance history",
          "Tracks vendor performance against SLAs and delivery commitments",
          "Sends renewal reminders before contract expiration",
          "Processes vendor payments on schedule and flags discrepancies",
          "Generates vendor scorecards for quarterly business reviews",
        ],
        "documentation": {
          "overview": "Your vendors are critical to your business — but managing them is often an afterthought. Contracts expire without renewal, payments are late, and performance issues go untracked because nobody owns the vendor relationship.\n\nA vendor manager keeps every vendor relationship organized and on track. It tracks performance, manages contracts, processes payments, and alerts you before renewals. Your vendors stay accountable, and your costs stay under control.\n\nYou get the best from your vendors because you're managing them actively, not reactively.",
          "howItWorks": [
            {"step": 1, "title": "Vendors Are Onboarded", "description": "Each vendor is added to the system with their contract details, SLAs, contacts, and payment terms."},
            {"step": 2, "title": "Performance Is Tracked", "description": "Delivery times, quality metrics, and SLA compliance are tracked for every vendor. Issues are logged and flagged."},
            {"step": 3, "title": "Renewals Are Managed", "description": "At 90, 60, and 30 days before a contract expires, you get an alert. You can renew, renegotiate, or put the contract out to bid."},
            {"step": 4, "title": "Payments Are Processed", "description": "Vendor invoices are matched against contracts and POs, approved, and processed on schedule. Discrepancies are flagged."},
          ],
          "benefits": [
            {"title": "Never Miss a Contract Renewal", "description": "Vendor contracts renew or expire on your terms. No more auto-renewals you didn't want or lapses you didn't expect.", "metric": "100% renewal tracking"},
            {"title": "Hold Vendors Accountable", "description": "When you track performance against SLAs, vendors deliver better service. You have data to back up your conversations.", "metric": "25% improvement in vendor SLA compliance"},
            {"title": "On-Time Vendor Payments", "description": "Processing payments on time maintains good vendor relationships and avoids late fees. Your vendors prioritize your business.", "metric": "98% on-time vendor payments"},
          ],
          "useCases": [
            {"title": "You Run a Restaurant", "description": "You have 15 vendors — food suppliers, linen services, equipment maintenance, and more. The vendor manager tracks every contract, processes payments, and flags when your produce supplier's quality drops below standard."},
            {"title": "You're a Manufacturer", "description": "Raw material suppliers have different lead times, quality standards, and payment terms. The vendor manager tracks performance and alerts you when a supplier misses delivery windows."},
            {"title": "You Own a Retail Chain", "description": "You negotiate volume discounts with suppliers across 10 locations. The vendor manager tracks compliance with volume commitments and flags when you're not hitting discount thresholds."},
          ]
        }
      },
      {
        "name": "Process Optimizer",
        "description": "Analyzes your workflows and identifies bottlenecks, redundancies, and automation opportunities.",
        "capabilities": [
          "Maps your current workflows and identifies inefficiencies",
          "Flags redundant steps, manual handoffs, and bottlenecks",
          "Recommends automation opportunities with estimated time savings",
          "Tracks process performance metrics over time",
          "Generates before-and-after comparisons when changes are implemented",
        ],
        "documentation": {
          "overview": "Every business has processes that evolved over time — steps that made sense once but don't anymore. Maybe someone manually transfers data between systems that could be connected. Maybe an approval requires three signatures when one would do. These inefficiencies compound over time.\n\nA process optimizer analyzes your workflows, finds the waste, and tells you exactly where to improve. It identifies automation opportunities, redundant steps, and bottlenecks that slow your team down.\n\nYou make your operations faster, cheaper, and more reliable — not by working harder, but by working smarter.",
          "howItWorks": [
            {"step": 1, "title": "Current Processes Are Mapped", "description": "The optimizer documents your existing workflows — every step, every handoff, every decision point."},
            {"step": 2, "title": "Inefficiencies Are Identified", "description": "The optimizer flags redundant steps, manual processes that could be automated, and bottlenecks where work gets stuck."},
            {"step": 3, "title": "Recommendations Are Made", "description": "For each inefficiency, the optimizer recommends a specific improvement with estimated time and cost savings."},
            {"step": 4, "title": "Improvements Are Tracked", "description": "When you implement a change, the optimizer tracks the before-and-after metrics so you can see the impact."},
          ],
          "benefits": [
            {"title": "Find Hidden Inefficiencies", "description": "You'd be surprised how much time is wasted on redundant steps and manual handoffs. The optimizer finds them all.", "metric": "20-40% time savings on key processes"},
            {"title": "Data-Driven Improvement Decisions", "description": "Instead of guessing where to improve, you have data. You know exactly which changes will have the biggest impact.", "metric": "Prioritized improvement roadmap"},
            {"title": "Track the Impact of Changes", "description": "When you make a change, you can measure the before-and-after. You know if the improvement actually worked.", "metric": "Measurable process improvements"},
          ],
          "useCases": [
            {"title": "You Run a Law Firm", "description": "The process optimizer finds that your intake process has 14 steps, 6 of which are redundant. By streamlining, you reduce new client onboarding from 5 days to 2 days."},
            {"title": "You Own a Manufacturing Business", "description": "The optimizer identifies a bottleneck in your quality inspection process. By reordering the steps and adding an automated check, you increase throughput by 30%."},
            {"title": "You're a Marketing Agency", "description": "The optimizer finds that your approval process requires 3 sign-offs for every deliverable. By reducing to 1 sign-off for standard work, you cut your delivery time in half."},
          ]
        }
      },
      {
        "name": "Compliance Checker",
        "description": "Monitors your operations for compliance with regulations and internal policies.",
        "capabilities": [
          "Checks your processes against regulatory requirements",
          "Flags potential compliance violations before they become problems",
          "Generates compliance reports for auditors",
          "Tracks changes in regulations that affect your business",
          "Maintains documentation for compliance audits",
        ],
        "documentation": {
          "overview": "Compliance isn't optional — but it's complicated. Regulations change, requirements vary by industry and location, and the penalties for getting it wrong are severe. Most businesses compliance is reactive: they fix problems after they're caught.\n\nA compliance checker is proactive. It monitors your operations against regulatory requirements, flags potential violations before they become problems, and maintains the documentation you need for audits.\n\nYou stay compliant without hiring a full-time compliance officer. And when the auditor comes, you're ready.",
          "howItWorks": [
            {"step": 1, "title": "Requirements Are Defined", "description": "You set the regulations and internal policies that apply to your business. The checker uses these as its benchmark."},
            {"step": 2, "title": "Operations Are Monitored", "description": "The checker continuously monitors your operations — data handling, documentation, processes — against your compliance requirements."},
            {"step": 3, "title": "Violations Are Flagged", "description": "When something doesn't comply, the checker flags it immediately with details on what's wrong and how to fix it."},
            {"step": 4, "title": "Reports Are Generated", "description": "Compliance reports are generated for internal review or external audits. Everything is documented."},
          ],
          "benefits": [
            {"title": "Catch Violations Before Regulators Do", "description": "Proactive monitoring means you fix issues before they become fines or legal problems.", "metric": "90% of violations caught internally"},
            {"title": "Audit-Ready Documentation", "description": "When an auditor asks for proof of compliance, the documentation is already organized and ready.", "metric": "100% audit-ready documentation"},
            {"title": "Stay Current on Regulation Changes", "description": "The checker tracks regulatory changes that affect your business. You know about new requirements before they take effect.", "metric": "Real-time regulatory change tracking"},
          ],
          "useCases": [
            {"title": "You Run a Healthcare Practice", "description": "HIPAA compliance requires specific data handling, documentation, and access controls. The compliance checker monitors your systems and flags any potential HIPAA violations."},
            {"title": "You're a Financial Advisor", "description": "SEC and FINRA regulations govern how you handle client data, communicate recommendations, and document advice. The checker monitors your compliance across all requirements."},
            {"title": "You Own a Restaurant", "description": "Health department regulations, labor laws, and food safety requirements all apply. The checker monitors your operations and flags issues before your next inspection."},
          ]
        }
      },
      {
        "name": "Shipping & Fulfillment",
        "description": "Generates shipping labels, tracks shipments, and sends tracking to customers.",
        "capabilities": [
          "Generates shipping labels from your order data with the best carrier and rate",
          "Tracks shipments across carriers and updates order status automatically",
          "Sends tracking numbers and delivery updates to customers via email or text",
          "Handles returns — generates return labels and processes received items",
          "Flags delayed or exception shipments for proactive customer communication",
        ],
        "documentation": {
          "overview": "Shipping is where the promise meets the product. You've made the sale — now you have to get the item to the customer. But managing shipping across multiple carriers, tracking deliveries, and handling returns is a logistical headache.\n\nA shipping and fulfillment service handles the entire fulfillment flow. It generates labels, picks the best carrier, tracks every shipment, and keeps customers informed. When something goes wrong — a delay, a lost package — it flags it before the customer has to ask.\n\nYour customers get their orders on time with full visibility. Your team stops spending hours at the carrier's website. And returns are handled smoothly.",
          "howItWorks": [
            {"step": 1, "title": "An Order Is Placed", "description": "A customer places an order. The fulfillment service pulls the order details — items, address, shipping preference."},
            {"step": 2, "title": "A Label Is Generated", "description": "The service compares carrier rates and delivery times, picks the best option, and generates the shipping label. Your team prints and packs."},
            {"step": 3, "title": "The Shipment Is Tracked", "description": "From pickup to delivery, the service tracks the package. The customer gets automatic updates at each stage."},
            {"step": 4, "title": "Exceptions Are Handled", "description": "If a package is delayed or lost, the service flags it immediately. Your team can proactively reach out to the customer before they get frustrated."},
          ],
          "benefits": [
            {"title": "Customers Get Real-Time Tracking", "description": "No more 'where's my order?' emails. Customers get automatic tracking updates from shipment to delivery.", "metric": "60% fewer WISMO inquiries"},
            {"title": "Find the Best Shipping Rates", "description": "The service compares carriers for every shipment. You always get the best rate for the delivery speed you need.", "metric": "20% savings on shipping costs"},
            {"title": "Returns Are Painless", "description": "Return labels are generated automatically, and received items are processed quickly. Customers get their refunds faster.", "metric": "50% faster return processing"},
          ],
          "useCases": [
            {"title": "You Run an E-Commerce Store", "description": "You ship 100 orders a day across the US. The fulfillment service generates labels, picks the best carrier for each destination, and sends tracking to customers. Your team focuses on packing, not rate-shopping."},
            {"title": "You're a Wholesale Distributor", "description": "You ship pallets to retailers with specific delivery windows. The fulfillment service coordinates LTL freight, tracks shipments, and alerts you to delays."},
            {"title": "You Sell Subscription Boxes", "description": "Every month, 500 boxes go out on the same day. The fulfillment service generates all 500 labels, batches them by carrier, and tracks every delivery."},
          ]
        }
      },
      {
        "name": "Contract Management",
        "description": "Sends contracts for signature, tracks renewals, and stores executed documents.",
        "capabilities": [
          "Sends contracts for e-signature with automated reminders for unsigned documents",
          "Tracks contract milestones, renewal dates, and expiration deadlines",
          "Stores executed contracts in a searchable, organized repository",
          "Alerts you 30, 60, and 90 days before a contract expires or renews",
          "Flags contracts with non-standard terms or missing signatures",
        ],
        "documentation": {
          "overview": "Contracts are the backbone of your business relationships — but managing them is surprisingly chaotic. They're scattered across email inboxes, shared drives, and filing cabinets. Renewal dates pass without anyone noticing. Signature requests go unanswered for weeks.\n\nA contract management service brings order to the chaos. It sends contracts for signature, tracks every deadline, stores executed documents, and alerts you before renewals. You always know where every contract stands and when action is needed.\n\nNo more missed renewals. No more lost contracts. No more chasing signatures.",
          "howItWorks": [
            {"step": 1, "title": "A Contract Is Ready to Send", "description": "You upload the contract and add the signer's email. The service sends it for e-signature with a professional message."},
            {"step": 2, "title": "Reminders Go Out", "description": "If the contract isn't signed within your timeframe, automatic reminders go out. You can see who's opened it and who hasn't."},
            {"step": 3, "title": "The Contract Is Executed", "description": "Once signed, the contract is stored in your repository. Key dates — effective date, renewal date, expiration — are extracted and tracked."},
            {"step": 4, "title": "Renewals Are Managed", "description": "At 90, 60, and 30 days before renewal or expiration, you get an alert. You can renew, renegotiate, or let it lapse — on your schedule."},
          ],
          "benefits": [
            {"title": "Never Miss a Renewal", "description": "Contracts renew or expire on schedule. You're never caught off guard by an auto-renewal you didn't want or a lapse you didn't expect.", "metric": "100% renewal tracking"},
            {"title": "Faster Signature Collection", "description": "Automated reminders and e-signature mean contracts get signed in days, not weeks.", "metric": "70% faster contract execution"},
            {"title": "All Contracts in One Place", "description": "Every executed contract is stored, searchable, and organized. No more digging through email attachments.", "metric": "Single source of truth for all contracts"},
          ],
          "useCases": [
            {"title": "You Run a Marketing Agency", "description": "Every client engagement starts with a signed SOW. The contract management service sends the SOW for signature, tracks when it's signed, and stores the executed copy. When the SOW is up for renewal, you get an alert 60 days out."},
            {"title": "You're a Property Manager", "description": "You manage 200 leases with different renewal dates. The contract management service tracks every lease and alerts you 90 days before renewal so you can negotiate terms or find a new tenant."},
            {"title": "You're a Freelancer", "description": "You send contracts to every client. The service sends for signature, follows up with reminders, and stores the executed copy. You always have a record of what was agreed to."},
          ]
        }
      },
      {
        "name": "Employee Onboarding",
        "description": "Creates accounts, assigns equipment, and schedules training for new hires.",
        "capabilities": [
          "Creates accounts in all required systems — email, Slack, HR software, tools",
          "Assigns equipment and sends provisioning requests to IT",
          "Schedules training sessions and orientation meetings",
          "Sends the new hire a welcome sequence with everything they need",
          "Tracks onboarding progress and flags incomplete steps",
        ],
        "documentation": {
          "overview": "The first week at a new job sets the tone for everything. If the new hire's email doesn't work, their laptop isn't ready, and nobody told them what to do on day one — they start questioning their decision. Great onboarding makes new employees feel welcome and productive from day one.\n\nAn employee onboarding service automates the entire process. From the moment the offer is signed, it creates accounts, assigns equipment, schedules training, and sends the new hire everything they need. Nothing falls through the cracks because every step is tracked.\n\nYour new hires are productive faster. Your HR team spends less time on logistics. And every new employee gets a consistent, professional experience.",
          "howItWorks": [
            {"step": 1, "title": "A New Hire Is Added", "description": "HR enters the new hire's information — name, role, start date, manager. The onboarding process begins automatically."},
            {"step": 2, "title": "Accounts Are Created", "description": "Email, Slack, project management, HR software — every account is created and credentials are sent to the new hire."},
            {"step": 3, "title": "Equipment Is Assigned", "description": "IT gets a provisioning request with everything the new hire needs. Laptop, monitor, software licenses — all ordered and ready before day one."},
            {"step": 4, "title": "Training Is Scheduled", "description": "Orientation meetings, training sessions, and check-ins are scheduled with the right people. The new hire's first week is planned out."},
          ],
          "benefits": [
            {"title": "New Hires Are Productive on Day One", "description": "Their accounts work, their equipment is ready, and their schedule is set. They start contributing immediately.", "metric": "100% day-one readiness"},
            {"title": "Consistent Experience for Every Hire", "description": "Every new employee gets the same smooth onboarding, regardless of who their manager is or when they start.", "metric": "Standardized onboarding for all roles"},
            {"title": "HR Saves 5 Hours Per Hire", "description": "The onboarding service handles the logistics so HR can focus on the human side — welcome conversations, culture building, and relationship building.", "metric": "5 hours saved per new hire"},
          ],
          "useCases": [
            {"title": "You're a Fast-Growing Startup", "description": "You're hiring 10 people a month. Each new hire needs accounts in 6 systems, a laptop, and a week of training. The onboarding service handles all of it — by the time the new hire starts day one, everything is ready."},
            {"title": "You Run a Retail Chain", "description": "New store employees need POS access, scheduling accounts, and safety training. The onboarding service creates the accounts, assigns the training, and sends the new hire their first-week schedule before they walk in the door."},
            {"title": "You're a Professional Services Firm", "description": "New associates need access to the CRM, the document management system, the time tracking tool, and the client portal. The onboarding service provisions everything and schedules their orientation with the managing partner."},
          ]
        }
      },
      {
        "name": "Inventory Auto-Reorder",
        "description": "Monitors stock levels and auto-generates purchase orders at reorder points.",
        "capabilities": [
          "Monitors inventory levels across warehouses and sales channels in real time",
          "Triggers purchase orders when stock hits your defined reorder points",
          "Adjusts reorder quantities based on demand forecasts and lead times",
          "Sends purchase orders to vendors and tracks confirmation and delivery",
          "Alerts you when stock is critically low or when a vendor hasn't confirmed",
        ],
        "documentation": {
          "overview": "Running out of stock means lost sales. Ordering too much means cash tied up in inventory. Finding the right balance is hard — especially when you're selling across multiple channels and managing dozens of SKUs.\n\nAn inventory auto-reorder service monitors your stock levels in real time and generates purchase orders automatically when items hit your reorder points. It considers lead times, demand forecasts, and vendor minimums to order the right amount at the right time.\n\nYou stop running out of bestsellers. You stop overstocking slow movers. And your purchasing runs itself.",
          "howItWorks": [
            {"step": 1, "title": "Stock Levels Are Monitored", "description": "The service tracks inventory across all your warehouses and sales channels in real time. Every sale, return, and adjustment is reflected immediately."},
            {"step": 2, "title": "Reorder Points Are Hit", "description": "When an item's stock hits the reorder point you defined, the service calculates the optimal order quantity based on lead time and demand forecast."},
            {"step": 3, "title": "Purchase Orders Are Generated", "description": "A purchase order is created and sent to the vendor automatically. You can review and approve first, or let it go out automatically."},
            {"step": 4, "title": "Delivery Is Tracked", "description": "The service tracks the PO until it's confirmed and delivered. If the vendor hasn't confirmed within a set time, you get an alert."},
          ],
          "benefits": [
            {"title": "Never Run Out of Stock", "description": "Automatic reordering means you always have inventory on hand. No more lost sales because you forgot to reorder.", "metric": "95% in-stock rate on top SKUs"},
            {"title": "Reduce Excess Inventory", "description": "The service orders based on actual demand, not guesswork. Your inventory turns faster and your carrying costs drop.", "metric": "30% reduction in excess inventory"},
            {"title": "Purchasing Runs Itself", "description": "Your purchasing team focuses on vendor relationships and negotiations, not on manually creating POs for routine reorders.", "metric": "80% of POs generated automatically"},
          ],
          "useCases": [
            {"title": "You Run an E-Commerce Store", "description": "Your top 50 SKUs sell consistently month after month. The inventory auto-reorder service monitors stock levels and generates POs with your suppliers before you run out. You never lose a sale to an out-of-stock."},
            {"title": "You Own a Hardware Store", "description": "You carry 5,000 SKUs with different suppliers and lead times. The auto-reorder service tracks every SKU and generates POs grouped by supplier. Your manager reviews and sends."},
            {"title": "You're a Restaurant Group", "description": "Food costs are your biggest expense. The auto-reorder service tracks ingredient usage and generates orders with your food distributor based on your menu forecast."},
          ]
        }
      },
    ]
  },
  {
    "department": "Competitive Intelligence",
    "icon": "search",
    "items": [
      {
        "name": "Competitor Monitor",
        "description": "Tracks your competitors' moves — pricing, hiring, marketing, and product changes.",
        "capabilities": [
          "Monitors competitor websites, job boards, and social media for changes",
          "Alerts you when a competitor changes pricing, launches a product, or posts a job",
          "Tracks competitor ad campaigns and messaging changes",
          "Compiles weekly intelligence briefs summarizing key developments",
          "Benchmarks your positioning against competitors over time",
        ],
        "documentation": {
          "overview": "Your competitors are making moves every day — changing prices, launching products, hiring for new roles, running new ad campaigns. If you're not watching, you're reacting. And in business, reacting means you're already behind.\n\nA competitor monitor watches your competitors for you. It tracks their websites, job boards, social media, and ad campaigns. When something changes, you get an alert. Every week, you get a brief summarizing the key developments.\n\nYou stay informed without spending hours on research. And you spot opportunities and threats before they become obvious to everyone else.",
          "howItWorks": [
            {"step": 1, "title": "You Define Your Competitive Set", "description": "You tell the monitor which competitors to track and what to watch for — pricing, hiring, product changes, ad campaigns, content."},
            {"step": 2, "title": "Competitors Are Monitored", "description": "The monitor scans competitor websites, job boards, social media, and ad libraries on a continuous basis."},
            {"step": 3, "title": "Changes Are Detected and Alerted", "description": "When a competitor changes their pricing, posts a job for a new role, or launches a campaign, you get an alert with the details."},
            {"step": 4, "title": "Weekly Briefs Are Delivered", "description": "Every week, you get a summary of all competitive activity. You see the trends, the patterns, and the moves that matter."},
          ],
          "benefits": [
            {"title": "Spot Opportunities Before Competitors", "description": "When a competitor raises prices, you know immediately. When they stop running ads in a channel, you see the opening.", "metric": "Real-time competitive alerts"},
            {"title": "Understand Their Strategy", "description": "Hiring patterns reveal strategy. If a competitor is hiring 10 salespeople, they're about to go after market share. If they're hiring engineers, a product launch is coming.", "metric": "Strategic intelligence from public signals"},
            {"title": "Stop Guessing, Start Knowing", "description": "Instead of wondering what your competitors are up to, you know. Your decisions are based on facts, not assumptions.", "metric": "Full competitive visibility"},
          ],
          "useCases": [
            {"title": "You're a SaaS Company", "description": "A competitor just launched a new feature. The competitor monitor detects the announcement, captures the pricing change, and alerts your product team. You respond with your own announcement before the competitor gains momentum."},
            {"title": "You Run a Regional Retail Chain", "description": "A national competitor just opened stores in your area. The competitor monitor detected the job postings three months before the stores opened. You had time to adjust your marketing and loyalty programs."},
            {"title": "You're a Marketing Agency", "description": "You need to know what your competitors are pitching. The competitor monitor tracks their case studies, blog posts, and ad campaigns. You see their positioning and differentiate your pitches."},
          ]
        }
      },
      {
        "name": "Competitor Price Tracker",
        "description": "Monitors competitor pricing changes and alerts you when they adjust.",
        "capabilities": [
          "Tracks competitor pricing across websites, marketplaces, and product pages",
          "Alerts you immediately when a competitor raises or lowers their prices",
          "Maintains a historical price database so you can analyze pricing trends",
          "Compares your pricing against competitors and flags where you're over or under",
          "Generates pricing reports by product category, competitor, and time period",
        ],
        "documentation": {
          "overview": "Pricing is the fastest lever in business. A competitor drops their price by 10% and your sales dry up overnight. But if you don't know about it until your customers tell you, it's too late to respond.\n\nA competitor price tracker monitors your competitors' pricing across their websites and marketplaces. When they change a price — up or down — you get an alert immediately. You see the full pricing history, compare against your own prices, and make informed decisions about your pricing strategy.\n\nYou respond to pricing changes in hours, not weeks. And you spot pricing trends before they become problems.",
          "howItWorks": [
            {"step": 1, "title": "Competitor Products Are Added", "description": "You define which competitor products to track and where to find their pricing — their website, Amazon, or other marketplaces."},
            {"step": 2, "title": "Prices Are Monitored", "description": "The tracker checks competitor pricing on a daily basis. Every price point is recorded in a historical database."},
            {"step": 3, "title": "Changes Trigger Alerts", "description": "When a competitor changes their price, you get an immediate alert with the old price, new price, and percentage change."},
            {"step": 4, "title": "Reports Are Generated", "description": "You can pull pricing reports by competitor, product category, or time period. You see trends and make data-driven pricing decisions."},
          ],
          "benefits": [
            {"title": "Respond to Price Changes in Hours", "description": "When a competitor drops their price, you know immediately. You can match, differentiate, or hold — but you decide on your terms.", "metric": "Same-day response to competitor price changes"},
            {"title": "Optimize Your Pricing Strategy", "description": "Historical pricing data shows you how competitors price, when they run promotions, and where the market is heading. You price smarter.", "metric": "Data-driven pricing decisions"},
            {"title": "Protect Your Margins", "description": "When a competitor raises their prices, it's an opportunity for you to capture margin or gain share. The price tracker makes sure you see it.", "metric": "5-15% margin improvement from optimized pricing"},
          ],
          "useCases": [
            {"title": "You Run an E-Commerce Store", "description": "You sell the same products as five other online retailers. The price tracker monitors all five and alerts you when any of them changes a price. You adjust your pricing strategy daily based on real market data."},
            {"title": "You're a SaaS Company", description: "Your competitors change their pricing pages frequently — adding tiers, changing limits, running promotions. The price tracker captures every change so your product and sales teams always have current competitive pricing."},
            {"title": "You Own a Grocery Store", "description": "You need to stay competitive on 200 key items. The price tracker monitors competitor flyers and online pricing, so you know when to match a price and when your pricing is already competitive."},
          ]
        }
      },
    ]
  },
];