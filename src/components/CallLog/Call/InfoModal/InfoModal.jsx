import Modal from "../../../UI/Modal/Modal";
import Breaker from "../../../UI/Breaker/Breaker";
import moment from "moment";
import classes from "./InfoModal.module.scss";
import Attribute from "../Attribute/Attribute";

/* This modal show the call information */

const InfoModal = ({
  show,
  id,
  form,
  to,
  direction,
  call_type,
  duration,
  via,
  notes = [],
  created_at,
  toggleInfoModal,
  onAddNote,
}) => {
  const getFormatedDate = (date) => {
    return moment(new Date(date)).format("MMM Do YY, h:mm:ssa");
  };

  const formSubmitHandler = (e) => {
    e.preventDefault();
    const { target } = e;
    let formData = Object.fromEntries(new FormData(target));
    onAddNote({ id, content: formData.content });
  };

  return (
    <Modal show={show} onClickOutside={toggleInfoModal}>
      <div className={classes.CallInfoModal}>
        <h2>Call Information</h2>
        <Breaker />
        <div className={classes.Numbers}>
          <p>
            <strong>From: </strong>
            {form}
          </p>
          <p>
            <strong>To: </strong>
            {to}
          </p>
        </div>
        <ul className={classes.CallInfo}>
          <Attribute title="Direction:" value={direction} />
          <Attribute title="Statue:" value={call_type} />
          <Attribute title="Duration:" value={duration} />
          <Attribute title="Via:" value={via} />
          <Attribute title="At:" value={getFormatedDate(created_at)} />
          <Attribute title="Notes:" value={notes.length} />{" "}
          <div className={classes.NotesBox}>
            <ul className={classes.NoteList}>
              {!notes.length && <p>No notes.</p>}
              {notes.length > 0 &&
                notes.map((note, indx) => {
                  return (
                    <li key={note.content} className={classes.NoteListItem}>
                      <strong>{indx + 1}.</strong> {note.content}
                    </li>
                  );
                })}
              <li>
                <form onSubmit={formSubmitHandler} className={classes.InputBox}>
                  <input
                    type="text"
                    placeholder="Add new note"
                    name="content"
                    required
                  />
                  <button>+</button>
                </form>
              </li>
            </ul>
          </div>
        </ul>
      </div>
    </Modal>
  );
};

export default InfoModal;
