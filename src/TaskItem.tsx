import React, { useState } from "react";
import { ListItem, TextField, Grid } from "@material-ui/core";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { db } from "./firebase";
import { updateDoc, deleteDoc, doc } from "firebase/firestore";
import styles from "./TaskItem.module.css";

interface Props {
  id: string;
  title: string;
}

const TaskItem: React.VFC<Props> = (props) => {
  const [title, setTitle] = useState(props.title);
  //   編集
  const editTask = async () => {
    await updateDoc(doc(db, "tasks", props.id), {
      title,
    });
  };
  //   削除
  const deleteTask = async () => {
    await deleteDoc(doc(db, "tasks", props.id));
  };
  return (
    <ListItem>
      <h2>{props.title}</h2>
      {/* 右側 */}
      <Grid container justifyContent="flex-end">
        {/* 入力項目  */}
        <TextField
          label="Edit task"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
        />
        {/* 編集 */}
        <button className={styles.taskitem__icon} onClick={editTask}>
          <EditOutlinedIcon />
        </button>
        {/* 削除 */}
        <button className={styles.taskitem__icon} onClick={deleteTask}>
          <DeleteOutlineOutlinedIcon />
        </button>
      </Grid>
    </ListItem>
  );
};

export default TaskItem;
