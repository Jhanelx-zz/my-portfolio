import ContactView from "./ContactView";
import {
  getPublicContact,
  getPublicSocialLinks,
  getPublishedProfile,
} from "@/lib/cms/public-data";

export default async function ContactPage() {
  const [contactResult, socialsResult, profileResult] = await Promise.all([
    getPublicContact(),
    getPublicSocialLinks(),
    getPublishedProfile(),
  ]);

  return (
    <ContactView
      contact={contactResult.data}
      socials={socialsResult.data}
      profile={profileResult.mode === "database" ? profileResult.data : null}
    />
  );
}
