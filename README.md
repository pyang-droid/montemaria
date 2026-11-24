# Montemaria

Montemaria is a Next.js application using Firebase Authentication, Cloud Firestore, and Firebase Storage. The production Vercel site uses the `monte-maria-3a9e7` Firebase project. The local web-app configuration may point to `monte-maria`, which has its own data and accounts. Keep Firebase Admin credentials out of the browser.

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

Attraction records are managed individually through the tourism administrator's attractions page, which supports creating, editing, and deleting records. For open, published paid attractions, booking start times are generated from the estimated duration and operating schedule; when duration is entered as a range, the longer estimate is used, and a slot is shown only when the full visit fits before closing. Enter schedules as time ranges such as `7:00 AM - 7:30 PM`; separate multiple open periods with commas. Verify capacities and all attraction details before publishing. Replacement image uploads from the edit form require working Firebase Storage access. The visitor dashboard lists only Firestore records explicitly active and published. The landing-page carousel and landmark gallery retain their original site-content displays and do not represent live availability.

| Collection | Purpose and core fields |
| --- | --- |
| `users/{uid}` | Auth profile: `email`, `role` (`visitor`, `staff`, `tourism`, or `admin`), `status` (`Active`/`Inactive`), optional name/contact/photo fields. Public sign-up can create only an active `visitor`. |
| `attractions/{id}` | Attraction catalog: `name`, generated `slug`, `type` (`Paid`/`Free`), `capacity`, `capacityIsPreview`, `currentVisitors`, `schedule`, `status` (`Open`/`Closed`), `isActive`, `isPublished`, `description`, `entranceFee`, and optional presentation fields (`tagline`, `fullDescription`, `duration`, `badge`, `highlights`). `capacity` and `currentVisitors` may remain unset until verified. Initial screenshot capacities are marked as temporary previews; public pages label them as such and do not derive occupancy or remaining availability from them. Public pages query only active, published attractions; closed attractions are not bookable. Booking time options are derived from `schedule` and `duration`; legacy `timeSlots` values are not used. |
| `attractionAccessRequests/{id}` | Visitor-created request for free access: `userId`, verified auth `userEmail`, `attractionId`, `attractionName`, `requestedVisitors`, `requestType` (`free_access`), `status` (`pending`/`approved`/`denied`), and timestamps. Administrator approval does not issue a QR code or admission ticket. |
| `bookings/{id}` | Visitor booking: `userId`, attraction ID/name, booking date/time, positive `numberOfVisitors`, `amount`, `status`, and `paymentStatus`. A client can create only a pending booking; a Tourism administrator can verify a QR payment and issue a ticket. |
| `payments/{id}` | Verified QR payment records. Only authorized administrators can create them, together with the corresponding booking confirmation. |
| `visitorLogs/{id}` | Staff-created audit events: booking/ticket, attraction, `eventType` (`ENTRY`, `EXIT`, or `DENIED`), party size, staff identity, and server timestamp. |
| `staffAssignments/{uid}` | Admin-managed staff assignment: `attractionId`, `attractionName`, and `active`. The document ID is the staff user's Firebase Auth UID. |

Attraction cover images are uploaded by administrators to `attractions/{id}/` in Firebase Storage. Admins can update attraction descriptions, highlights, duration, capacity, occupancy, operating state, and publication state from the Tourism Administration page. New attractions start unpublished and closed until an administrator verifies the details and explicitly publishes them. Unverified occupancy is stored as unknown, not as zero.

Provision staff and tourism administrator roles and assignment documents using a trusted administrator workflow. Do not grant roles through public sign-up or client writes. Review existing `users` records for any legacy privileged roles before deploying the rules.

## Security rules and indexes

Review the rules and schema against the target project before deployment. From an authenticated Firebase CLI session, deploy production rules and indexes to the project used by Vercel:

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage --project monte-maria-3a9e7
```

The rules restrict profile access, staff operations to assigned attractions, and payment confirmation to authorized administrators. The included composite indexes support booking activity, ticket verification, and the admission desk. Do not deploy permissive rules to make the UI appear populated.

## Payments and ticket issuance

Paid attractions with a configured QR display the selected GCash or Maya QR at checkout. Visitors pay the displayed total in their wallet and submit the transaction reference. In Tourism Dashboard ? Bookings, an administrator checks the reference and amount against the completed payment in the receiving wallet, then verifies the booking. Firestore records the payment, confirms the booking, and issues the ticket code in one transaction. Visitors can see their verification status and ticket code under My Bookings.

Each QR encodes a fixed single-ticket amount. Checkout enables the QR when the booking is for one visitor and the configured entrance fee matches that amount. Visitors can make separate bookings for additional tickets. Verification is manual. Deploy the updated Firestore rules with the app to enable administrative confirmation.

## Production deployment

This application uses the Next.js App Router and server-rendered hosting, so deploy it to a Next.js-compatible host such as Vercel. Add the required Firebase web configuration as deployment environment variables, deploy Firestore/Storage rules and indexes, enable the intended Firebase Authentication provider, and configure the production domain in Firebase Authentication. Firebase Hosting static hosting is not configured for this server-rendered application.

Before launch, test with the Firebase Emulator Suite or a non-production Firebase project, verify that role documents and attraction assignments are correct, and confirm the production domain and Firebase rules. No Firebase project data is seeded or modified by this repository setup.
