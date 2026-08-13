export type LegalBlock =
  | { type: "p" | "h2" | "h3"; text: string }
  | { type: "ul"; items: string[] }

export type LegalDocument = {
  slug: string
  title: string
  updated: string
  description: string
  blocks: LegalBlock[]
}

/**
 * Ported from the owner's previous site with the brand scrubbed. The text is
 * contractual — edits belong to the owner, not to code changes. Tokens
 * ({company}, {legalName}, {email}, {phone}, {domain}) are filled from
 * siteConfig at render time so business details stay in src/config/site.ts.
 * The "terms" and "refund" documents were replaced 13 Aug 2026 with the text
 * of the owner-supplied Quality Assurance / Terms & Conditions / Cancellation
 * Policy document (brand scrubbed the same way) — do not add clauses beyond
 * what that document contains without the owner's sign-off.
 */
export const legalDocuments: LegalDocument[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    updated: "May 30, 2016",
    description: "How {company} collects, uses, and protects the personal information you share with us, including our cookie policy.",
    blocks: [
      {
        type: "p",
        text: "At {company}, your privacy is important to us. To better protect your privacy we provide this notice explaining our online information practices and the choices you can make about the way your information is collected and used. To make this notice easy to find, we make it accessible from every page of our website."
      },
      {
        type: "p",
        text: "This privacy notice applies solely to information collected by this website. It includes:"
      },
      {
        type: "ul",
        items: [
          "What personally identifiable information is collected from you through the website, how it is used and with whom it may be shared.",
          "What choices are available to you regarding the use of your data.",
          "The security procedures in place to protect the misuse of your information.",
          "How you can correct any inaccuracies in the information."
        ]
      },
      {
        type: "h2",
        text: "Information Collection, Use, and Sharing"
      },
      {
        type: "p",
        text: "{company} will not obtain personally-identifying information about you when you visit our website, unless you choose to provide such information to us in the information request forms or our online reservation system."
      },
      {
        type: "p",
        text: "This information you submit when requesting more information about our services includes your name, address, email address and phone numbers. We will use your information to respond to you, regarding the reason you contacted us. We will not share your information with any third party outside of our organization, other than as necessary to fulfill your request."
      },
      {
        type: "p",
        text: "Our online reservation system offers secure communications by encrypting all data to and from the site via a thawte SSL123 Certificate. The information in the SSL certificate that thawte issues includes the verification of the website's registered domain name. This enables you to check the site's validity yourself, which you should always do before entering any sensitive information."
      },
      {
        type: "p",
        text: "We are the sole owners of the information collected on this website. We only have access to and collect information that you voluntarily give us via email or other direct contact from you. We will not sell or rent this information to any third parties."
      },
      {
        type: "p",
        text: "We do not provide personally identifiable information to unaffiliated third parties for their use in marketing directly to you. {company} may use unaffiliated companies to help it maintain and operate its website or for other reasons related to the operation of its business, and those companies may receive your personally identifiable information for that purpose. We may also disclose personally identifiable information about you in connection with legal requirements, such as in response to an authorized subpoena, governmental request or investigation, or as otherwise permitted by law."
      },
      {
        type: "p",
        text: "Unless you ask us not to, we may contact you via email in the future to tell you about specials, new products or services or changes to this privacy policy."
      },
      {
        type: "p",
        text: "When you visit the {company} website, like when you visit most other websites, certain anonymous information about your visit is automatically logged, which may include information about the type of browser you use, the server name and IP address through which you access the Internet (such as \"google.com\" or \"yahoo.com\"), the date and time you access the site, the pages you access while at our website, and the Internet address of the website, if any, from which you linked directly to the {company} website. This information is not personally identifiable."
      },
      {
        type: "p",
        text: "We use the anonymous browsing information collected automatically by our servers primarily to help us administer and improve our website. We may also use non-identifying and aggregate information to better design our website. Finally, we never use or share the personally identifiable information provided to us online in ways unrelated to the ones described above without also providing you an opportunity to opt-out or otherwise prohibit such unrelated uses."
      },
      {
        type: "h2",
        text: "Your Access to & Control Over Information"
      },
      {
        type: "p",
        text: "You may opt out of any future contacts from us at any time. You can do the following at any time by contacting us via the email address or phone number given on our website:"
      },
      {
        type: "ul",
        items: [
          "See what data we have about you, if any.",
          "Change/correct any data we have about you.",
          "Have us delete any data we have about you.",
          "Express any concern you have about our use of your data."
        ]
      },
      {
        type: "h2",
        text: "Cookie Policy"
      },
      {
        type: "p",
        text: "This Cookies Policy forms part of our general Privacy Policy."
      },
      {
        type: "p",
        text: "In common with most other websites, we use cookies and similar technologies to help us understand how people use {company}. This allows us to continually improving our website. We have created this Cookies Policy to provide you with clear and transparent information about the technologies & services that we use on {company}."
      },
      {
        type: "p",
        text: "If you choose to use our website without blocking or disabling cookies or opting out of other technologies, you will indicate your consent to our use of these cookies and other technologies and to our use (in accordance with this policy and the rest of our Privacy Policy) of any personal information that we collect using these technologies. If you do not consent to the use of these technologies, please be sure to block or disable them using your browser settings, or the settings within our mobile apps."
      },
      {
        type: "h2",
        text: "What cookies are used for on this Website?"
      },
      {
        type: "p",
        text: "Some of the cookies on our website are essential for us to be able to provide you with a service you have requested. An example of this would be a cookie used to enable you to log into your account on the website or which allows communication between your browser and the website. This particular cookie helps our client's user experience and also makes the upload speed/site speed much faster."
      },
      {
        type: "h2",
        text: "Types of Software, Tracking & Marketing Used on This Site"
      },
      {
        type: "h3",
        text: "Google Analytics & Webmaster Tools:"
      },
      {
        type: "p",
        text: "We use Google analytics & Webmaster Tools cookies to help us understand how users engage with our website. An example is counting the number of different people coming to our website or using a particular feature, rather than the total number of times the site or feature is used. Another example is tracking the type of device that is used most commonly for engagement on this site. Without this cookie, if you visited the website once each week for three weeks we would count you as three separate users. We would find it difficult to assess how well our website (desktop, tablet & mobile) is performing and improve it without these cookies."
      },
      {
        type: "h3",
        text: "VWO (Visual Website Optimizer):"
      },
      {
        type: "p",
        text: "VWO's software is used to show multiple versions of our site to different users. It benefits the user experience by offering A/B testing for optimal user experience and conversions. VMO creates and A.B tests different versions or our website to continually discover the best performing versions that increase the user feedback."
      },
      {
        type: "h3",
        text: "Google AdWords and Google Remarketing:"
      },
      {
        type: "p",
        text: "{company} leverages Google AdWords and the Google Remarketing technology, both operated by the company Google Inc. (\"Google\")."
      },
      {
        type: "p",
        text: "For measuring conversion with Google AdWords, a conversion tracking cookie is placed when a user clicks on a {company} text ad, display ad or any other internet marketing that Google might offer. Conversion tracking cookies expire after 30 days and are not used for personal identification. Google uses a different cookie for each Google AdWords customer and there is no consolidation of the cookie data with other data. If you click on one of our Ads and proceed to a page equipped with a conversion tag and the cookie has not yet expired, the conversion is documented. Conversion tracking cookies tell us the total number of conversions and are reviewed for performance."
      },
      {
        type: "p",
        text: "Google Re-marketing cookies are placed to serve our Ads to you at a later time when you browse pages that are part of the Google content network. Remarketing cookies expire after 30 days and are not used for personal identification. For more information on Google Remarketing."
      },
      {
        type: "h3",
        text: "Social Sharing:"
      },
      {
        type: "p",
        text: "We use third party cookies to allow you to share content directly on the social networking/sharing sites like Facebook, Instagram, Twitter or Youtube. Examples would be if you wanted to \"like\" or \"tweet\" about us or our products or services."
      },
      {
        type: "p",
        text: "Please see our \"Third Party Cookies\" section below for more detail."
      },
      {
        type: "h2",
        text: "How to Control or Opt Out of Cookies:"
      },
      {
        type: "p",
        text: "You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. If you do this, however, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work. For more information on how to delete or disable cookies form your browser please use the \"help\" function within your browser."
      },
      {
        type: "p",
        text: "If you want to know more about how cookies work and how to manage or delete them, visit the World Wide Web & search \"How Cookies Work\"."
      },
      {
        type: "p",
        text: "We may update this policy from time to time so you may want to check it each time you visit our website. The Last update was done on May 30th 2016."
      }
    ]
  },
  {
    slug: "terms",
    title: "Terms and Conditions",
    updated: "August 2026",
    description: "The terms and conditions that govern every {company} charter reservation, including booking, payment, conduct, and liability policies.",
    blocks: [
      {
        type: "p",
        text: "At {company}, we are dedicated to delivering reliable, safe, and professional transportation solutions nationwide."
      },
      {
        type: "h2",
        text: "Quality Assurance"
      },
      {
        type: "ul",
        items: [
          "Safety: All vehicles are maintained in compliance with federal and state regulations, and drivers are properly licensed, insured, and trained.",
          "Reliability: We emphasize punctuality and careful trip planning to ensure services are delivered according to the agreed itinerary.",
          "Comfort: Our charter vehicles are equipped with modern amenities designed to provide a smooth and comfortable ride.",
          "Customer Satisfaction: Client feedback is valued, and concerns are addressed promptly and professionally.",
          "Professionalism: We maintain high standards of conduct from initial inquiry through trip completion."
        ]
      },
      {
        type: "h2",
        text: "Terms & Conditions"
      },
      {
        type: "p",
        text: "This Agreement is entered into between {legalName} (\"Company\" or \"Lessor\") and the customer (\"Lessee\") for the charter of transportation services, including but not limited to Sprinter Vans, Mini Buses, Charter Buses, Party Buses, School Buses, and Limousines."
      },
      {
        type: "h3",
        text: "1. Reservations and Booking"
      },
      {
        type: "p",
        text: "All reservations are subject to availability and operational requirements. Prices are not guaranteed until a reservation is confirmed in writing. Once confirmed, the agreed-upon price is locked. The Company reserves the right to cancel service without refund for violations of safety rules, unlawful activity, or passenger misconduct."
      },
      {
        type: "h3",
        text: "2. Pricing and Payment"
      },
      {
        type: "p",
        text: "A 50% deposit is due within three (3) days of signing this Agreement. The remaining balance must be paid no later than fourteen (14) days prior to the scheduled trip. Bookings made within fifteen (15) days of departure require full payment at the time of confirmation."
      },
      {
        type: "h3",
        text: "3. Cancellation Policy"
      },
      {
        type: "p",
        text: "Cancellations must be submitted in writing and are effective upon receipt by {legalName}. The applicable cancellation fees are outlined in our Cancellation Policy."
      },
      {
        type: "h3",
        text: "4. No-Show Policy"
      },
      {
        type: "p",
        text: "Failure of the Lessee or passengers to appear at the scheduled pickup time will be considered a no-show. In such cases, the full rental amount will be due and non-refundable."
      },
      {
        type: "h3",
        text: "5. Passenger Conduct"
      },
      {
        type: "p",
        text: "All passengers must behave in a respectful and lawful manner. The Company reserves the right to terminate service immediately for unsafe, disruptive, or unlawful conduct. The Lessee will be responsible for any resulting costs or damages."
      },
      {
        type: "h3",
        text: "6. Liability"
      },
      {
        type: "p",
        text: "The Company takes reasonable precautions to ensure passenger safety but is not liable for delays, injuries, or damages unless caused by gross negligence. The Lessee assumes responsibility for passenger behavior and personal belongings."
      },
      {
        type: "h3",
        text: "7. Vehicle Substitution"
      },
      {
        type: "p",
        text: "While every effort is made to provide the requested vehicle, the Company may substitute a comparable or larger vehicle if necessary due to mechanical issues or availability."
      },
      {
        type: "h3",
        text: "8. Cleaning and Damage"
      },
      {
        type: "p",
        text: "Excessive cleaning fees may apply if the vehicle is returned in an unsanitary condition. The Lessee is financially responsible for any damage incurred during the rental period."
      },
      {
        type: "h3",
        text: "9. Prohibited Activities"
      },
      {
        type: "p",
        text: "Smoking, drug use, and alcohol consumption are strictly prohibited unless expressly authorized in writing. Onboard restrooms are for urination only; misuse will result in a $500 sanitation fee."
      },
      {
        type: "h3",
        text: "10. Additional Charges"
      },
      {
        type: "p",
        text: "Additional mileage, extended hours, or itinerary changes beyond the agreed scope may result in extra charges payable upon completion of the trip. The Company is not responsible for lost or stolen items."
      },
      {
        type: "h3",
        text: "11. Payment Methods"
      },
      {
        type: "p",
        text: "Accepted payment methods include ACH transfer, wire transfer, overnight check payable to {legalName}, card payment, and Venmo. Please contact the Company for payment instructions."
      },
      {
        type: "h3",
        text: "12. Governing Law and Force Majeure"
      },
      {
        type: "p",
        text: "This Agreement shall be governed by the laws of the applicable operating state. The Company shall not be held liable for delays or cancellations caused by force majeure events, including natural disasters, extreme weather, civil unrest, government restrictions, or traffic conditions."
      }
    ]
  },
  {
    slug: "refund",
    title: "Refund Policy",
    updated: "August 2026",
    description: "Our Cancellation Policy — when and how refunds are issued for {company} charter reservations based on how far in advance you cancel.",
    blocks: [
      {
        type: "p",
        text: "Cancellations must be submitted in writing and are effective upon receipt by {legalName}. The following cancellation fees apply based on how far in advance of your scheduled rental date we receive your written cancellation notice."
      },
      {
        type: "h2",
        text: "Cancellation Policy"
      },
      {
        type: "ul",
        items: [
          "Cancellations made forty-five (45) days or more prior to the scheduled departure date will receive a full refund, less a ten percent (10%) administrative fee.",
          "Cancellations made between thirty (30) and forty-five (45) days prior to the scheduled rental date will incur a fifty percent (50%) cancellation fee.",
          "Cancellations made within fifteen (15) days of the scheduled rental date will result in the full rental amount being due, and no refund will be issued.",
          "All cancellation requests must be submitted in writing. The effective date of cancellation is the date written notice is received by {legalName}."
        ]
      },
      {
        type: "p",
        text: "See our Terms and Conditions for our No-Show Policy and other reservation terms."
      }
    ]
  }
]

export function getLegalDocument(slug: string) {
  return legalDocuments.find((d) => d.slug === slug)
}
