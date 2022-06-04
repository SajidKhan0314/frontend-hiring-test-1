import { Fragment, useState } from "react";
import Icons from "../../UI/Icons/Icons";
import InfoModal from "./InfoModal/InfoModal";
import moment from "moment";
import classes from "./Call.module.scss";
import Attribute from "./Attribute/Attribute";

/* This component is used to show the call information in the list */

const Call = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  let subDetailsStyleClasses = [classes.CallSubDetails, classes.Close].join(
    " "
  );

  if (isOpen) {
    subDetailsStyleClasses = [classes.CallSubDetails, classes.Open].join(" ");
  }

  // Fire the Archive call function from the parent
  const archive = (e) => {
    e.stopPropagation();
    props.onArchiveCall(props.id);
  };

  // Toggle info modal
  const toggleInfoModal = (e) => {
    e.stopPropagation();
    setShowModal((oldState) => !oldState);
  };

  // Format date
  const getFormatedDate = (date) => {
    return moment(new Date(date)).format("MMM Do YY, h:mm:ssa");
  };

  return (
    <Fragment>
      <InfoModal
        {...props}
        show={showModal}
        toggleInfoModal={toggleInfoModal}
        onAddNote={props.onAddNote}
      />
      <li className={classes.CallListItem}>
        <div
          className={classes.Call}
          onClick={() => setIsOpen((oldState) => !oldState)}
        >
          <span className={classes.CallIcon}>
            <Icons height={1.4} width={1.4} name="call" />
          </span>
          <div className={classes.CallDetails}>
            <p>
              <strong>From:</strong> <small>{props.from}</small>
            </p>
            <p>
              <strong>To:</strong> <small>{props.to}</small>
            </p>
            <ul className={subDetailsStyleClasses}>
              <Attribute title="Direction:" value={props.direction} />
              <Attribute title="Statue:" value={props.call_type} />
              <Attribute title="Duration:" value={props.duration} />
              <Attribute title="Via:" value={props.via} />
              <Attribute
                title="At:"
                value={getFormatedDate(props.created_at)}
              />
              <Attribute title="Notes:" value={props.notes.length} />
            </ul>
          </div>
          {props.is_archived && (
            <i className={classes.ArchivedText}>
              <small>Archived</small>
            </i>
          )}
          {!props.is_archived && (
            <button
              title="Archive Call"
              className={classes.CallArchiveButton}
              onClick={archive}
            >
              <Icons height={1.4} width={1.4} name="archive" />
            </button>
          )}
          <button
            title="Call Information"
            className={classes.CallInfoButton}
            onClick={toggleInfoModal}
          ></button>
        </div>
      </li>
    </Fragment>
  );
};

export default Call;
