import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import { auth, db } from "./firebase";
import { collection, onSnapshot, addDoc, query } from "firebase/firestore";
import { FormControl, TextField, List } from "@material-ui/core";
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import TaskItem from "./TaskItem";
import { makeStyles } from "@material-ui/styles";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

const useStyles = makeStyles({
  field: {
    marginTop: 30,
    marginBottom: 20,
  },
  list: {
    margin: "auto",
    width: "40%",
  },
});

const App: React.VFC = () => {
  const [tasks, setTasks] = useState([{ id: "", title: "" }]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const classes = useStyles();
  useEffect(() => {
    const q = query(collection(db, "tasks"));
    // dbで変更がある度にデータを取り直す
    const unSub = onSnapshot(q, (snapshot) => {
      setTasks(
        snapshot.docs.map((doc) => ({ id: doc.id, title: doc.data().title }))
      );
    });
    // アンマウント時イベント解除
    return () => unSub();
  }, []);
  useEffect(() => {
    const unSub = auth.onAuthStateChanged((user) => {
      !user && navigate("/login");
    });
    return () => unSub();
  }, [navigate]);
  const newTask = (e: React.MouseEvent<HTMLButtonElement>) => {
    addDoc(collection(db, "tasks"), { title: input });
    setInput("");
  };
  return (
    <div className={styles.app__root}>
      <h1>Todo App by React/Firebase</h1>
      <button
        className={styles.app__logout}
        onClick={async () => {
          try {
            await signOut(auth);
            navigate("/login");
          } catch (err: any) {
            alert(err.message);
          }
        }}
      >
        <ExitToAppIcon />
      </button>
      <br />
      <FormControl>
        <TextField
          label="New Task"
          InputLabelProps={{
            shrink: true,
          }}
          className={classes.field}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </FormControl>
      <button className={styles.app__icon} disabled={!input} onClick={newTask}>
        <AddToPhotosIcon />
      </button>
      <List className={classes.list}>
        {tasks.map((task) => (
          <TaskItem key={task.id} id={task.id} title={task.title}></TaskItem>
        ))}
      </List>
    </div>
  );
};

export default App;
