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

const consoleSubmissionSender: SubmissionSender = {
  async send(submission) {
    console.info(
      `${submission.kind} submission received:`,
      JSON.stringify(submission.data, null, 2)
    )
  },
}

export const submissionSender: SubmissionSender = consoleSubmissionSender
