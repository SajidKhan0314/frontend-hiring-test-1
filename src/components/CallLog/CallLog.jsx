import { useState, useEffect, useCallback, useContext } from "react";
import Icons from "../UI/Icons/Icons";
import Breaker from "../UI/Breaker/Breaker";
import Call from "./Call/Call";
import moment from "moment";
import classes from "./CallLog.module.scss";
import Loader from "../UI/Loader/Loader";
import useEffectOnce from "../../hooks/useEffectOnce";
import Pusher from "pusher-js";
import { AuthContext } from "../../context/authContext";
import CallServices from "../../services/CallServices";

/* This component is responsible for displahying the call log*/

const Calls = () => {
  const { isLoading: authLoading } = useContext(AuthContext);
  const [calls, setCalls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [dates, setDates] = useState([]);

  // Update calls on "update-call" event from pusher
  const updateCalls = useCallback(
    (data) => {
      if (!calls.length) {
        return;
      }

      let updatedCallIndex = calls.findIndex(
        (currCall) => data.id === currCall.id
      );
      setCalls((oldState) => {
        let udpatedCallsArr = [...oldState];
        udpatedCallsArr[updatedCallIndex] = data;
        return udpatedCallsArr;
      });
    },
    [calls]
  );

  // Start Pusher listner
  useEffect(() => {
    const userToken = localStorage.getItem("access_token");
    const pusher = new Pusher("d44e3d910d38a928e0be", {
      auth: {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + userToken,
        },
      },
      authEndpoint: "https://frontend-test-api.aircall.io/pusher/auth",
      cluster: "eu",
      encrypted: true,
    });
    const channel = pusher.subscribe("private-aircall");
    channel.bind("update-call", (data) => {
      updateCalls(data);
    });
  }, [calls, updateCalls]);

  // Archive a call
  const archiveCall = useCallback((id) => {
    setIsLoading(true);
    setError(null);
    CallServices.archiveCall(
      { id },
      (data) => {},
      (err) => {},
      () => {
        setIsLoading(false);
      }
    );
  }, []);

  // Add note to a call
  const addNote = useCallback(({ id, content }) => {
    setIsLoading(true);
    setError(null);
    CallServices.addNote(
      { id, content },
      (data) => {},
      (err) => {},
      () => {
        setIsLoading(false);
      }
    );
  }, []);

  // Load more calls
  const loadMore = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setHasNextPage(false);
    CallServices.loadMoreCalls(
      { length: calls.length },
      (data) => {
        setDates(data.dates);
        setCalls([...calls, ...data.calls]);
        setHasNextPage(data.hasNextPage);
      },
      (err) => {},
      () => {
        setIsLoading(false);
      }
    );
  }, [calls]);

  // Fetch initial Calls
  useEffectOnce(() => {
    CallServices.fetchCalls(
      { length: calls.length },
      (data) => {
        setDates(data.dates);
        setCalls(data.calls);
        setHasNextPage(data.hasNextPage);
      },
      (err) => {
        setError("Something went wrong. Please try again later.");
      },
      () => {
        setIsLoading(false);
      }
    );
  });

  // Call elements to display
  let callElements = null;

  // If data is available, show calls
  if (dates.length && calls.length) {
    callElements = [];
    // Group calls on date
    dates.forEach((date) => {
      callElements.push(
        <h4 key={date + Math.random()} className={classes.GroupHeader}>
          {moment(new Date(date)).format("MMM Do YY")}
        </h4>
      );
      for (let selectedCall of calls) {
        if (new Date(selectedCall.created_at).toLocaleDateString() === date) {
          callElements.push(
            <Call
              key={selectedCall.id + Math.random()}
              {...selectedCall}
              onArchiveCall={archiveCall}
              onAddNote={addNote}
            />
          );
        }
      }
    });
  }

  // SHow this if fetch api returns empty array
  if (!isLoading && !dates.length && !calls.length) {
    callElements = <p className={classes.NoCalls}>No calls.</p>;
  }

  // SHow this if there is any error
  if (!isLoading && error) {
    callElements = <p className={classes.Error}>{error}</p>;
  }

  return (
    <div className={classes.CallLogContainer}>
      <div className={classes.CallsBox}>
        <Loader show={isLoading || authLoading} />
        <h4 className={classes.HeaderTertiary}>Call Log</h4>
        <Breaker />
        <ul className={classes.CallList}>{callElements}</ul>
      </div>
      {hasNextPage && (
        <button className={classes.MoreCalls} onClick={loadMore}>
          Load more calls <Icons height={1} width={1} name="chevron-down" />
        </button>
      )}
    </div>
  );
};

export default Calls;
