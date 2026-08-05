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
    updated: "2024",
    description: "The terms and conditions that govern every {company} charter reservation, including payment, cancellation, and change policies.",
    blocks: [
      {
        type: "p",
        text: "Thank you for choosing {legalName} for your transportation needs. We have more than a decade of hands-on experience in the ground transportation industry and are committed to giving you a safe first-class transportation experience. This document sets forth the terms and conditions of the agreement between you (the \"customer\" or \"you\") and {company}. This agreement, when signed, binds you and your agents, heirs, and assigns to all terms set forth herein. To ensure the highest levels of customer service, we will assign you a project manager within 48 hours after receipt of your confirmation. To track, pay, or make changes to your itinerary, please use our online system at {domain}. If you have additional questions, please contact your project manager by email."
      },
      {
        type: "h2",
        text: "{company} Payment Policy"
      },
      {
        type: "p",
        text: "{company} requires you to be 21 years or older and have a valid U.S. or Canadian credit card to hold and secure your reservation if you are paying by credit card. Once you have agreed to the terms and conditions (whether or not you have made a deposit), you are responsible for the cost of your charter, pursuant to our cancellation policy. {company} requires a cardholder's signature, without this your reservation will not be processed but you will still be responsible for all cancellation fees. Your credit card will be charged based on the payment schedule displayed during your booking process and upon confirmation of your vendor. {company} also accepts wire transfers, ACH payments, certified checks, business checks, personal checks and money orders. {company} is not responsible for any overdrawn bank fees. If you pay by check, you must give {company} the right to authorize your credit card for the full amount of the charter rental. If the check is not received by the due date stated in your agreement, {company} shall have the right to charge your credit card for the full charter cost. If your reservation is made within fifteen (15) days prior to departure of your charter bus trip, you must pay by certified check, wire transfer, credit card or ACH Payment. If you make changes to your charter, at any time, which require the payment of additional fees, those fees must be paid when your change is confirmed. Only one discount can be applied to a charter, Promo or coupons. They cannot be combined."
      },
      {
        type: "h2",
        text: "First-Come, First-Served Policy"
      },
      {
        type: "p",
        text: "All {company} charter services are reserved on a first-come, first-served basis. {company} reserves the right to cancel your reservation if a requested vehicle is unavailable, has mechanical problems, or if you have not made all required payments by the agreed-upon dates. If your requested vehicle is unavailable, {company} may seek alternative vehicles to accommodate your travel needs. If securing a replacement vehicle results in additional charges, you, may accept the new vehicle and new rates or cancel the contract without incurring a cancellation fee."
      },
      {
        type: "h2",
        text: "Final Confirmation"
      },
      {
        type: "p",
        text: "Once your reservation is confirmed, {company} will email you a charter confirmation. Any modifications or changes to the final confirmation must be made within 48 hours of receipt of the confirmation. {company} shall not be required to honor any changes made more than 48 hours after final confirmation, including changes in pick-up times, locations, and type of vehicle. You may also incur change fees as documented below."
      },
      {
        type: "h2",
        text: "Cancellation Policy"
      },
      {
        type: "p",
        text: "The Cancellation Policy applies to all clients including those clients that reserve vehicle less than 28 days of departure. {company} must receive all cancellation requests in writing stating the charter number, departure date and reason for cancellation via email at {email}. Verbal cancellation requests will not be accepted as valid. To be valid a cancellation must be made by the person whose name appears on the contract. Charters are subject to cancellation by {company} if payments are not made by due date."
      },
      {
        type: "ul",
        items: [
          "Cancellations over 28 days prior to departure date are subject to 5% of the total cost of trip up to $250.",
          "Cancellations made 28 to 15 days prior to the departure date are subject to 25% of total trip cost.",
          "Cancellations made 14 to 8 days are subject to the loss of 50% of the total charter cost.",
          "Cancellations made 7 days to 72 hours are subject to the loss of 75% of the total charter cost.",
          "Cancellations made within 72 hours are subject to the loss of 100% of total charter cost."
        ]
      },
      {
        type: "p",
        text: "Refunds can take up to 120 days to process."
      },
      {
        type: "p",
        text: "Once you agree to terms and conditions, should you choose to cancel while your reservation is still in processing up to 7 business days after booking you will still be liable for a cancellation fee based on the cancellation policy."
      },
      {
        type: "p",
        text: "If the client does not return a phone call or email from {company} for at least 14 days {company} has the right to cancel any reservation and keep 75% of the charter costs."
      },
      {
        type: "h2",
        text: "Charter Cancellation Protection"
      },
      {
        type: "p",
        text: "You can purchase charter cancellation protection for $30.00. The purchase of charter cancellation protection will reduce all applicable cancellation fees by 50 (fifty) percent, up to a maximum of $500.00 (five hundred dollars). To qualify for the charter cancellation protection, you must provide {company} with a minimum of 10 days notice prior to your departure date. All payments for charter cancellation protection are non-refundable."
      },
      {
        type: "h2",
        text: "Change Policy"
      },
      {
        type: "p",
        text: "If you make any modifications (including first changes) to your itinerary affecting pickup and drop-off times, {company} reserves the right to adjust the total cost of your charter to reflect the changes."
      },
      {
        type: "p",
        text: "All changes to your itinerary, including any revised pickup or drop-off times or locations, must be submitted to {company} at least 7 (seven) business days prior to your charter departure date. No change or modification shall be valid unless and until approved by {company}. Any requested changes will be subject to availability."
      },
      {
        type: "p",
        text: "There is no change fee for your first itinerary change unless the requested changes affect pickup or drop-off times, stops or distance traveled. All subsequent changes to your itinerary will incur a fee:"
      },
      {
        type: "ul",
        items: [
          "All subsequent itinerary changes made more than 5 days prior to departure date that do not affect times, stops or distance will incur a $75 (seventy five dollar) change fee",
          "All subsequent itinerary changes made 5 days or less before your departure date that do not affect times, stops or distance will incur a $100 (one hundred dollar) change fee"
        ]
      },
      {
        type: "p",
        text: "You must make all itinerary changes online. If you cannot do so and require {company} to make the changes, you will be assessed an additional administrative fee of $49.99 for every change. If the changes are made less than 14 days prior to departure, an administrative fee of $149.99 will be charged."
      },
      {
        type: "p",
        text: "All time shall be rounded up to full hours and all mileage is on a round-trip basis."
      },
      {
        type: "p",
        text: "If you modify the vehicle that has been reserved for your trip, please note that pricing may change based on vehicle type and availability."
      },
      {
        type: "p",
        text: "Changes to travel dates made more than 30 days prior to your departure date will be assessed a $350 change fee and will be subject to vehicle availability. Changes to travel dates made less than 30 days prior to your departure date are considered a cancellation (as set forth above) and will require rebooking. {company} reserves the right to charge different rates based on current market conditions. If you book a new departure date, but cancel that date, the cancellation fee shall be based on your original departure date."
      },
      {
        type: "h2",
        text: "Overtime"
      },
      {
        type: "p",
        text: "Overtime is available at the drivers' and at {company}' discretion. Your cost is based on the services detailed in your final confirmation and is subject to change in accordance with the actual itinerary. Overtime charges shall be assessed at:"
      },
      {
        type: "ul",
        items: [
          "$95 (ninety five dollars) per half hour for 24 to 56 passenger coaches",
          "$175 (one hundred seventy five dollars) per half hour for limo buses and exotic limos",
          "$75 (seventy five dollars) per half hour for vans and school buses",
          "$350 (three hundred fifty dollars) per half hour for any specialty vehicles, including Maybach and Rolls Royce Phantom"
        ]
      },
      {
        type: "h2",
        text: "Price Match Guarantee"
      },
      {
        type: "p",
        text: "{company} shall match any lower price offered by a competitor, subject to the following terms and conditions:"
      },
      {
        type: "ul",
        items: [
          "The competing quote must be for the same type and size of bus, of the same age, with the same number of seats and the same amenities",
          "The competing charter company must be DOT compliant and must be subject to matching DOT regulations",
          "The competing charter company must be within 25 miles of one of the following cities: Atlanta, GA; Baltimore, MD; Boston, MA; Chicago, IL; Dallas-Fort Worth, TX; Detroit, MI; Greater New York City, NY; Houston, TX; Los Angeles, CA; Miami, FL; Orlando, FL; San Francisco, CA; Washington, DC",
          "The price match guarantee must be requested at least 30 days before scheduled departure",
          "The competitor's quote must be received within five days of customer's receipt of {company} quote",
          "The competitor's quote must include tolls, and fuel surcharge",
          "Price matches are not valid on Friday and Saturdays or on overnight trips",
          "The price match guarantee shall not be available in the following states: Alabama, Alaska, Arizona, Arkansas, Colorado, Hawaii, Idaho, Iowa, Kentucky, Louisiana, Maine, Minnesota, Mississippi, Missouri, Montana, Nevada, New Hampshire, New Mexico, North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina, South Dakota, Utah, Vermont, Washington, Wisconsin and Wyoming",
          "Party buses & Executive Mini Buses are excluded from price match"
        ]
      },
      {
        type: "h2",
        text: "Fuel Surcharge"
      },
      {
        type: "p",
        text: "If your regional average for diesel fuel rises above $4.00 per gallon, you will be assessed an additional 10% surcharge. For every 25 (twenty five) cents that the regional average cost for diesel fuel rises above $4.00 per gallon, you will be assessed an additional 2.5% fuel surcharge. This is based on EIA.gov rates."
      },
      {
        type: "h2",
        text: "Interest"
      },
      {
        type: "p",
        text: "All payments due to {company} shall accrue interest at a rate of 1.5 (one and one-half) percent per month, commencing 30 (thirty) days after an invoice is issued."
      },
      {
        type: "h2",
        text: "Food and Alcohol Policy"
      },
      {
        type: "p",
        text: "You must notify {company} in advance if you plan to bring food or beverages on your coach. {company} reserves the right to deny your request and/or to require an additional security deposit. No smoking, sexual activity or use of illegal drugs are allowed on your coach at any time. Any alcohol consumption on a {company} charter is subject to applicable laws and affiliate bus operator rules. Alcohol may not be consumed by or served to any passengers on your coach unless all passengers are twenty-one (21) years of age or older. {company}, its affiliates, and its employees reserve the right, in their sole discretion, to refuse service to or expel from a coach any member of your group whose conduct is deemed inappropriate or poses a hazard to other passengers, the driver or the vehicle. {company} also reserves the right to terminate the charter bus trip at any time because of violation of food and/or alcohol policies. {company} may exercise this right by dropping you off at your home, the nearest police station or any previously agreed upon location. You may not bring or possess glass containers or kegs on the coach at any time. {company} reserves the right to assess an additional surcharge for a cleaning fee, should the cleanup time be more than customarily required:"
      },
      {
        type: "ul",
        items: [
          "The cleaning of vomit or other bodily fluids is a health and safety issue for subsequent passengers—you will be assessed a $250 (two hundred fifty dollar) service charge each time vomit or other bodily fluids must be cleaned up or removed.",
          "You will be assessed a $200 (two hundred dollar) service charge for every instance that spilled alcoholic beverages must be cleaned up or removed."
        ]
      },
      {
        type: "p",
        text: "You shall be responsible for any and all damage to the vehicle caused by any member of your group. The amount of the repairs will be assessed once a damage estimate has been obtained."
      },
      {
        type: "p",
        text: "This Agreement is to be governed by and construed in accordance with the laws of the DEPARTMENT OF BUSINESS AFFAIRS AND CONSUMER PROTECTION in the city of Chicago. For current and future charters in the city of Chicago, {company} will not allow alcohol on board for any vehicle 16 passengers or more and all occupants must be over 21 years of age we also will not allow any clients in the city limits of Chicago to visit multiple establishments that serve alcohol (bar hopping etc.) {company} prohibits any and all drinking on the vehicle during the duration of the charter. If any charter breaches these terms and conditions, the contract holder will be liable for any fines and charges, and conclude in the termination of the trip. By signing this agreement, you are hereby acknowledging that there will be no consumption of alcohol on the bus or any time during the duration of the charter without prior approval in the city of Chicago."
      },
      {
        type: "h2",
        text: "Special Requests"
      },
      {
        type: "p",
        text: "{company} will do its best to accommodate special requests including but not limited to WiFi, power outlets, TV, Video, address systems, bathroom or other facilities and equipment. However, not all vehicles are equipped with every amenity. The failure of a vehicle to be equipped with specific amenities shall not be deemed an event of default by {company}. This exemption shall not apply to specific requests for ADA accessible vehicles."
      },
      {
        type: "h2",
        text: "Amenity Assurance"
      },
      {
        type: "p",
        text: "You have the right to a coach where all amenities function properly. If any amenity on your charter bus malfunctions (including heat or air conditioning, restroom facilities, ADA Lifts. {company} will endeavor to either fix the problem or provide you with a replacement bus with as little disruption to your itinerary as possible. In addition, you shall be entitled to a credit up to 5% of the total charter cost for each day the amenity was not functioning, up to 20% of the total charter cost. Not to exceed $1000 per charter."
      },
      {
        type: "h2",
        text: "Lost Items"
      },
      {
        type: "p",
        text: "{company}, its affiliates and subsidiaries, employees and agents shall not be responsible for any items lost by passengers before, during or after a trip. Customer shall have the sole responsibility of checking for all personal belongings of passengers before passengers make any final disembarkation for the bus. {company} shall not have any obligation to perform any type of search for any lost item. It shall be the sole financial responsibility of the Customer to pay for any search conducted by any third party, such as a mechanic, to locate lost items in vents, seats and other areas on the bus. If a professional search is required, the Customer shall pay for the full rental cost of the bus for one calendar day. If such a search is contracted, Customer must arrange the search with {company} to ensure that the bus will be available on the date of the search. {company} has a lost and found department. Customer may submit information about any lost item to the {company} lost and found and {company} will use its best efforts to try to locate any lost item. Customer must, however, provide the charter number and the date of the charter to {company} by email. {company} shall have full discretion to determine when a lost and found matter shall be considered closed."
      },
      {
        type: "h2",
        text: "Mechanical Issues"
      },
      {
        type: "p",
        text: "{company} shall not guarantee refunds if your trip is affected by mechanical or service issues and shall retain, at its sole discretion, the right not to make any refunds whatsoever. If a vehicle supplied by {company} develops or experiences mechanical, electrical or other problems that render it inoperable, {company} shall, at its sole discretion, provide you another vehicle, of similar quality and cost, to complete the charter. The replacement vehicle shall satisfy {company}' contractual obligation. There shall be no refund when an alternate vehicle is provided. In the event that one or more electrical systems, including climate control, restroom facilities, radio, television, GPS or other electronic devices, shall malfunction, {company}' sole liability in such an instance shall be limited to 5 (five) percent credit of the total cost of the charter. Credits are good for 1 year after the release form is signed & shall only apply to future charters."
      },
      {
        type: "p",
        text: "Should {company} be solely responsible for a delay or failure to meet time requirements, other than as a result of weather, road, traffic conditions or other causes outside of the control of {company}, {company}' liability shall be limited to the following:"
      },
      {
        type: "p",
        text: "For any day trip, liability shall be limited to 5 (five) percent of the charter cost for a specific vehicle for each 30 minute period for which that vehicle is late, starting 30 minutes after pick up time. The total liability shall not to exceed 20 (twenty) percent of the total charter cost. Credits are good for 1 year after the release form is signed & shall only apply to future charters."
      },
      {
        type: "p",
        text: "For any overnight trip, liability shall be limited to 5 (five) percent of the total charter cost for a specific vehicle divided by the number of days set forth under Customer's fully executed final confirmation for each 30 minute period for which that vehicle is late, starting 30 minutes after pickup time. Liability shall not exceed 20 (twenty) percent of the total charter cost divided by the number of days specified in the Customer's executed final confirmation. Credits are good for 1 year after the release form is signed & shall only apply to future charters."
      },
      {
        type: "h2",
        text: "State Of Emergency Cancelation"
      },
      {
        type: "p",
        text: "If charter is canceled due to a state of emergency {company} will offer a credit on a future trip. This credit will be good for 1 year."
      },
      {
        type: "h2",
        text: "Refund Policy and Post Charter Concerns"
      },
      {
        type: "p",
        text: "All refund requests must be consistent with the terms and conditions set forth in this agreement and must be submitted in writing at {email}. All request or complaints must be filed within 30 days of your charter completion. When submitting a refund request, please use your charter number as your reference number. Should any dispute, claim, question, or disagreement (\"disputes\") arise related in any way to this agreement or any alleged breach of this agreement, the parties agree to consult and negotiate with each other in good faith and, recognizing their mutual interests, attempt to reach a just and equitable solution satisfactory to both parties. In the event there is a disruption or issue in your service, you agree to give {company} up to 14 business days to do a full investigation of the matter with all parties (including but not limited to; you, the driver, the affiliate, the dispatch team, the customer service team, reservationist) and to work with you to come to an amicable agreement. If a mutually acceptable resolution cannot be reached within 60 calendar days of the original notice to the other party, all disputes shall be resolved through the American Arbitration Association (\"AAA\"), located at 150 East 42nd Street, Floor 17, New York, New York 10017, in accordance with the provisions of its Commercial Arbitration Rules, and its Supplementary Procedures for Consumer-Related Disputes. The party filing the request for arbitration shall be solely responsible for the first $500 (five hundred dollars) in costs assessed for such arbitration. Any party who attempts to resolve a dispute without first filing for arbitration as set forth herein shall be responsible for any legal fees incurred by the other party to resolve the dispute."
      },
      {
        type: "p",
        text: "Refunds on canceled charters may not be issued for up to 120 days after the date of cancellation. All refunds shall be issued in the same form of payment as received. All credits to be applied to any future charter must be used within one year of the date those credits were issued."
      },
      {
        type: "p",
        text: "Please call us at {phone} to discuss any concerns that arise after your trip is finished."
      },
      {
        type: "h2",
        text: "General Policies"
      },
      {
        type: "p",
        text: "{company} reserves the right to lease equipment from other companies to any of the obligations set forth in this agreement."
      },
      {
        type: "p",
        text: "Customer shall make all reservations for any additional services that may be required, including overnight accommodations for drivers, special event permits, ferry service, onboard catering or meals. Parking fees are your responsibility and are not included in the cost of your charter. You are required to pay any necessary parking or other permit fees upon arrival, as required. Examples include stadium, concert, national park and theme park fees, as well as any other fees any jurisdiction may charge a bus to enter."
      },
      {
        type: "p",
        text: "If {company} is unable to perform the obligations required under this contract, and is unable to provide replacement transportation (which {company} shall select at its sole discretion), {company}' liability shall not include any responsibility for incidental, consequential or special damages, whether foreseeable or not. This shall include the costs of securing substitute and/or additional transportation; spoiled food and/or beverages; concert, theater, sports and/or other event tickets; admissions cost, reservations, plane or train tickets; and/or any and all other losses related to late pickup or no-show of requested transportation."
      },
      {
        type: "p",
        text: "{company} retains the right to upgrade a vehicle at its sole discretion."
      },
      {
        type: "p",
        text: "All problems with any charter in progress, whether mechanical or otherwise, must be called in to the {company} 24 hour dispatch department at {phone}. Failure to notify call the dispatch department while the problem is occurring will absolve {company} from responsibility arising from such issues."
      },
      {
        type: "p",
        text: "If a {company} bus arrives at the scheduled pick up location and no passengers board the vehicle within one hour of that scheduled pick up time, {company} reserves the right to immediately terminate the agreement and shall have no obligation to provide any refund."
      },
      {
        type: "p",
        text: "{company} shall not be liable for: Any items left on the vehicle, during or at the end of a trip Any loss of time to due to mechanical failure, inclement weather, or road conditions, including road repairs and accidents) Any other acts which {company} has no control"
      },
      {
        type: "p",
        text: "Customer understands and acknowledges that the trip type set forth in the final confirmation, incorporated herein by reference, shall be fully binding; and the liability of {company}, as described under this paragraph, shall likewise be limited by the final confirmation."
      },
      {
        type: "p",
        text: "Any and all credits issued by {company} expire within one year of the date the credit is issued. {company} cannot guarantee the assignment of any requested drivers, vehicles or amenities."
      },
      {
        type: "p",
        text: "All trips which exceed 15 hours of on-duty time and or 10 hrs of drive time in a 24 hr period require the driver to have eight (8) hours of off-duty time. The customer shall bear all responsibility for ensuring that enough time is built into the travel to arrive at all venues as scheduled. {company} shall not be liable for any incidental, consequential, or special damages, whether foreseeable or not, as a result of such delay. If changes are made to an itinerary after booking, {company} reserves the right to deny changes and or update the price to reflect said changes."
      },
      {
        type: "p",
        text: "{company} requires a copy of the front and back of any credit card being used for payment of services rendered, as well as a copy of the driver's license of the cardholder, should the total cost of the charter exceed $3,000 (three thousand dollars)."
      },
      {
        type: "p",
        text: "{company} is not responsible for any travel disruptions caused by depots that have been put out of service by the Federal Motor Carriers Safety Administration (FMCSA) because of safety or insurance reasons."
      },
      {
        type: "p",
        text: "Party bus seating capacity is measured from thigh to thigh, at an estimated 18-20 inches per seat. If you have passengers who cannot fit into that space, it may affect the seating capacity on your coach."
      },
      {
        type: "p",
        text: "No waiver of any provision of this contract shall be valid unless in writing and signed by the person against whom it is sought to be enforced. The failure of any party at any time to insist upon strict performance of any condition, promise, agreement or understanding set forth in this agreement shall not be considered or construed as a waiver or relinquishment of the right to insist upon strict performance at future time."
      },
      {
        type: "p",
        text: "All refund/credit requests shall be reviewed by {company} management. All requests for refunds or credit must be submitted no later than 30 days after the end of your trip."
      },
      {
        type: "p",
        text: "This agreement shall be governed by and construed in accordance with the laws of the state of New York."
      },
      {
        type: "p",
        text: "This contract may be executed in parts, each of which shall be deemed to be original but all of which together shall constitute one and the same agreement. The invalidity or unenforceability of any specific provision of this agreement shall not affect any other provisions, and this agreement shall be construed in all respects as if such invalid or unenforceable provision was omitted."
      },
      {
        type: "p",
        text: "The parties further agree that any and all disputes or claims arising out of or in connection with this agreement shall be resolved in the Supreme Court of the state of New York, Richmond County, New York."
      },
      {
        type: "p",
        text: "In the event {company} is forced to incur collection costs to recover past due fees of any kind, Customer hereby agrees to compensate {company} for any and all costs associated with such collection efforts, including the filing of a lawsuit, attorney's fees and costs for collection of such fees."
      },
      {
        type: "p",
        text: "{company} will not charter/rent a vehicle with a customer unless that person is at least 21 years old."
      },
      {
        type: "p",
        text: "{company} Safety Department reserves the right to cancel your quote or charter for any safety concern This includes, but is not limited to, D.O.T issues, driver concerns, weather, unsafe driving conditions, driver violations, and insurance lapses."
      },
      {
        type: "p",
        text: "Any minors must be accompanied by a legal aged chaperone based on your local state mandate or we reserve the right to cancel the trip."
      },
      {
        type: "p",
        text: "{company} reserves the right and may deem necessary to require a $500 deposit (per vehicle) via credit card or wire prior to departure date. If deposit is not collected prior to departure, the charter will be canceled. All cancelation fees will apply. This deposit will be refunded after the return trip as long as no damage or excessive cleanup has been reported. {company} also reserves the right to stop any charter/s mid-trip or cancel any charter/s due to safety and damage concerns."
      }
    ]
  },
  {
    slug: "refund",
    title: "Refund Policy",
    updated: "January 2025",
    description: "When and how refunds are issued for {company} charter reservations, including cancellation timelines and processing.",
    blocks: [
      {
        type: "p",
        text: "At {company}, we strive to provide exceptional service and customer satisfaction. This Refund Policy outlines the terms and conditions under which refunds may be issued for our charter bus and transportation services."
      },
      {
        type: "h2",
        text: "Cancellation and Refund Eligibility"
      },
      {
        type: "p",
        text: "Refunds are processed according to the following schedule based on when cancellation is requested:"
      },
      {
        type: "ul",
        items: [
          "14+ Days Before Trip: Full refund less a 5% processing fee",
          "7-13 Days Before Trip: 75% refund",
          "48 Hours - 6 Days Before Trip: 50% refund",
          "24-48 Hours Before Trip: 25% refund",
          "Less Than 24 Hours Before Trip: No refund",
          "No-Show: No refund"
        ]
      },
      {
        type: "h2",
        text: "Special Circumstances"
      },
      {
        type: "p",
        text: "In certain situations, exceptions may apply:"
      },
      {
        type: "ul",
        items: [
          "Weather-Related Cancellations: If severe weather conditions make travel unsafe, we will work with you to reschedule or provide a full refund",
          "Service Provider Cancellation: If we must cancel due to mechanical issues or other circumstances beyond your control, you will receive a full refund",
          "Long-Distance Trips: Cancellation policies for trips over 500 miles may differ and will be clearly stated in your booking agreement",
          "Special Events: Cancellation policies for major events, holidays, or peak seasons may have modified terms"
        ]
      },
      {
        type: "h2",
        text: "Refund Processing"
      },
      {
        type: "ul",
        items: [
          "Refunds will be processed using the same payment method used for the original transaction",
          "Processing time is typically 5-10 business days after approval",
          "Bank processing times may vary; allow additional time for the refund to appear in your account",
          "All refund requests must be submitted in writing via email or through our customer service portal"
        ]
      },
      {
        type: "h2",
        text: "Non-Refundable Items"
      },
      {
        type: "p",
        text: "The following items are non-refundable:"
      },
      {
        type: "ul",
        items: [
          "Processing fees (if applicable)",
          "Deposits on canceled bookings within 24 hours of trip",
          "Additional services or add-ons that have already been rendered",
          "Third-party fees (if applicable)"
        ]
      },
      {
        type: "h2",
        text: "Rescheduling vs. Refund"
      },
      {
        type: "p",
        text: "We encourage rescheduling when possible, as this may be more beneficial than canceling:"
      },
      {
        type: "ul",
        items: [
          "Rescheduling requests made 7+ days in advance typically incur no additional fees",
          "Rescheduling within 7 days may incur a rescheduling fee",
          "Subject to availability, you may reschedule your trip for a future date"
        ]
      },
      {
        type: "h2",
        text: "Disputes and Complaints"
      },
      {
        type: "p",
        text: "If you believe you are entitled to a refund that has not been granted, please contact our customer service team. We will review your case and respond within 5 business days. All disputes will be handled fairly and in accordance with this policy."
      }
    ]
  }
]

export function getLegalDocument(slug: string) {
  return legalDocuments.find((d) => d.slug === slug)
}
