# Montemaria

Montemaria is a Next.js application using Firebase Authentication, Cloud Firestore, and Firebase Storage. The client connects to the existing Firebase project (`monte-maria`) using the public web-app configuration; no Firebase Admin credentials belong in the browser.

## Local development

1. Enable Email/Password sign-in in Firebase Authentication.
2. Copy `.env.example` to `.env.local` and fill in the Firebase Web App configuration from the existing Firebase project:

   ```powershell
   Copy-Item .env.example .env.local
   ```

   Required variables are `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, and `NEXT_PUBLIC_FIREBASE_APP_ID`. `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` is optional.
3. Install dependencies and start the application:

   ```bash
   npm install
   npm run dev
   ```

The Firebase web configuration is public client configuration, not an authorization boundary. Firestore and Storage rules enforce access. Never put service-account keys or Firebase Admin credentials in `NEXT_PUBLIC_*` variables.

## Firestore data model

The application does not seed demonstration records. An empty collection is shown as an empty state; populate the existing project only with verified operational records.

| Collection | Purpose and core fields |
| --- | --- |
| `users/{uid}` | Auth profile: `email`, `role` (`visitor`, `staff`, `tourism`, or `admin`), `status` (`Active`/`Inactive`), optional name/contact/photo fields. Public sign-up can create only an active `visitor`. |
| `attractions/{id}` | Public attraction catalog: `name`, `type` (`Paid`/`Free`), positive integer `capacity`, integer `currentVisitors`, `schedule`, `status` (`Open`/`Closed`), `description`, `entranceFee`, and optional presentation fields. `timeSlots` is an array of `{ time: "HH:mm", label: string }`. |
| `bookings/{id}` | Visitor booking: `userId`, attraction ID/name, booking date/time, positive `numberOfVisitors`, `amount`, `status`, and `paymentStatus`. A client can create only a pending booking; trusted payment confirmation and ticket issuance must happen on a configured backend. |
| `payments/{id}` | Trusted payment records. Client writes are denied. Include `userId`, `bookingId`, `status`, `amount`, payment method/reference, and timestamps when a trusted payment integration is implemented. |
| `visitorLogs/{id}` | Staff-created audit events: booking/ticket, attraction, `eventType` (`ENTRY`, `EXIT`, or `DENIED`), party size, staff identity, and server timestamp. |
| `staffAssignments/{uid}` | Admin-managed staff assignment: `attractionId`, `attractionName`, and `active`. The document ID is the staff user's Firebase Auth UID. |

Provision staff and tourism administrator roles and assignment documents using a trusted administrator workflow. Do not grant roles through public sign-up or client writes. Review existing `users` records for any legacy privileged roles before deploying the rules.

## Security rules and indexes

Review the rules and schema against the existing project before deployment. From an authenticated Firebase CLI session, deploy rules and indexes to the existing project:

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage --project monte-maria
```

The rules restrict profile access, staff operations to assigned attractions, and payments to trusted backend writes. The included composite indexes support booking activity, ticket verification, and the admission desk. Do not deploy permissive rules to make the UI appear populated.

## Payments and ticket issuance

Paid checkout, payment confirmation, and ticket-code issuance are intentionally unavailable until a payment gateway and a trusted server-side integration are configured. The application does not create fake payment records or ticket codes. Client-created bookings remain pending and cannot be admitted by staff.

## Production deployment

This application uses the Next.js App Router and server-rendered hosting, so deploy it to a Next.js-compatible host such as Vercel. Add the required Firebase web configuration as deployment environment variables, deploy Firestore/Storage rules and indexes, enable the intended Firebase Authentication provider, and configure the production domain in Firebase Authentication. Firebase Hosting static hosting is not configured for this server-rendered application.

Before launch, test with the Firebase Emulator Suite or a non-production Firebase project, verify that role documents and attraction assignments are correct, and confirm the production domain and Firebase rules. No Firebase project data is seeded or modified by this repository setup.
