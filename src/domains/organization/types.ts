export type OrganizationUserRole = "SUPREME_ADMINISTRATOR" | string; // keep open for future roles

export type OrganizationUser = {
  userId: string;
  roles: OrganizationUserRole[];
};

export type Organization = {
  id: string;
  name: string;
  organizationType: string;
  logoUrl?: string | null;
  slogan?: string | null;
  address?: string | null;
  city: string;
  country: string;
  phoneNumber?: string | null;
  contactEmail: string;
  websiteUrl?: string | null;
  workingLicense: string;
  size?: string | number | null;
  chairmanName: string;
  chairmanIdentification: string;
  region: string;
  taxCode?: string | null;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  users: OrganizationUser[];
};
