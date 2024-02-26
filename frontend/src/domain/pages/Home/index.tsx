import React from "react";
import "./style.css";
import Nav from "../../components/common/Nav";
import Footer from "../../components/common/Footer";
import Stacks from "../../components/pageComponents/Stacks";

function Home() {
  return (
    <div>
      <Nav />
      <Stacks />
      <Footer />
    </div>
  );
}

export default Home;
