import { submissionEmail } from "@/lib/notification-email"
import { sendNotificationEmail } from "@/lib/resend-client"
import type {
  AffiliateInquiry,
  ContactMessage,
  DriverApplication,
  NewsletterSignup,
} from "@/lib/submissions"

export type Submission =
  | { kind: "contact"; data: ContactMessage }
  | { kind: "driver"; data: DriverApplication }
  | { kind: "affiliate"; data: AffiliateInquiry }
  | { kind: "newsletter"; data: NewsletterSignup }

export interface SubmissionSender {
  send(submission: Submission): Promise<void>
}

const emailSubmissionSender: SubmissionSender = {
  async send(submission) {
    await sendNotificationEmail(submissionEmail(submission))
  },
}

export const submissionSender: SubmissionSender = emailSubmissionSender
