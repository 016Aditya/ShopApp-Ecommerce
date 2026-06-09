import PageLayout from "@/components/layout/PageLayout";
import EmptyState from "@/components/common/EmptyState";

function Profile() {
  return (
    <PageLayout
      title="My Profile"
      description="Manage your account details and preferences."
    >
      <EmptyState
        title="Profile details coming soon"
        description="This profile page is ready as a placeholder and can now be connected to real user data."
      />
    </PageLayout>
  );
}

export default Profile;