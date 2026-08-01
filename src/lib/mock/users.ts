export type UserRole = "Admin" | "Editor" | "Author" | "Contributor";

export interface CmsUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  lastActive: string;
}

export const cmsUsers: CmsUser[] = [
  {
    id: "user_1",
    name: "Amaka Eze",
    email: "amaka.eze@scoopr.example.com",
    role: "Editor",
    avatarUrl: `/api/avatar/amaka-eze?name=Amaka%20Eze`,
    lastActive: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "user_2",
    name: "Tunde Bakare",
    email: "tunde.bakare@scoopr.example.com",
    role: "Author",
    avatarUrl: `/api/avatar/tunde-bakare?name=Tunde%20Bakare`,
    lastActive: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: "user_3",
    name: "Zainab Suleiman",
    email: "zainab.suleiman@scoopr.example.com",
    role: "Author",
    avatarUrl: `/api/avatar/zainab-suleiman?name=Zainab%20Suleiman`,
    lastActive: new Date(Date.now() - 26 * 3600000).toISOString(),
  },
  {
    id: "user_4",
    name: "Chidi Okafor",
    email: "chidi.okafor@scoopr.example.com",
    role: "Admin",
    avatarUrl: `/api/avatar/chidi-okafor?name=Chidi%20Okafor`,
    lastActive: new Date(Date.now() - 1 * 3600000).toISOString(),
  },
  {
    id: "user_5",
    name: "Grace Nwosu",
    email: "grace.nwosu@scoopr.example.com",
    role: "Contributor",
    avatarUrl: `/api/avatar/grace-nwosu?name=Grace%20Nwosu`,
    lastActive: new Date(Date.now() - 72 * 3600000).toISOString(),
  },
];
