import React from "react";
import "./style.css";
import Nav from "../../components/common/Nav";
import Footer from "../../components/common/Footer";
import Stacks from "../../components/pageComponents/Stacks";
import Todo from "../../components/pageComponents/Todo";

function Home() {
  const dateObject = new Date("2024-11-11T00:00:00");
  return (
    <div className="home">
      <Nav />
      <Todo
        id={5}
        title="hello"
        description="descr"
        pinned={false}
        completed={false}
        date={dateObject}
        priorityLevel="TOP"
      />
      <Footer />
    </div>
  );
}

export default Home;
