import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import CategoryBar from "./CategoryBar";
import Footer from "./Footer";

const PageWrapper = () => {
  return (
    <>
      <Navbar />
      <CategoryBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default PageWrapper;
