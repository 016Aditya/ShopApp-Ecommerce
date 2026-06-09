import PageLayout from "@/components/layout/PageLayout";
import EmptyState from "@/components/common/EmptyState";

function Orders() {
  return (
    <PageLayout
      title="My Orders"
      description="Track and review your previous purchases."
    >
      <EmptyState
        title="No orders yet"
        description="You have not placed any orders yet. Start shopping to see your orders here."
      />
    </PageLayout>
  );
}

export default Orders;