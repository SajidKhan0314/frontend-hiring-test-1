import axios from "../config/axios";

const sortDates = (arr) => {
  arr.sort(function (a, b) {
    const date1 = new Date(a);
    const date2 = new Date(b);

    return date2 - date1;
  });
  return arr;
};

/* This object provides all the api services required to fetch and update "calls" */

const CallServices = {
  fetchCalls: (data, success, error, final) => {
    axios
      .get("/calls")
      .then((res) => {
        let dates = res.data.nodes.map((el) =>
          new Date(el.created_at).toLocaleDateString()
        );
        let dateSet = new Set(dates);
        let uniqueDates = Array.from(dateSet);
        let sortedDates = sortDates(uniqueDates);
        success({
          dates: sortedDates,
          calls: res.data.nodes,
          hasNextPage: res.data.hasNextPage,
        });
      })
      .catch((err) => {
        error(err);
      })
      .finally(() => {
        final();
      });
  },
  loadMoreCalls: ({ length, oldDates }, success, error, final) => {
    axios
      .get(`/calls?offset=${length}&limit=10`)
      .then((res) => {
        let dates = res.data.nodes.map((el) =>
          new Date(el.created_at).toLocaleDateString()
        );
        let dateSet = new Set([...dates, ...oldDates]);
        let uniqueDates = Array.from(dateSet);
        let sortedDates = sortDates(uniqueDates);
        success({
          dates: sortedDates,
          calls: res.data.nodes,
          hasNextPage: res.data.hasNextPage,
        });
      })
      .catch((err) => {
        error(err);
      })
      .finally(() => {
        final();
      });
  },
  archiveCall: ({ id }, success, error, final) => {
    axios
      .put(`/calls/${id}/archive`)
      .then((res) => {
        success(res);
      })
      .catch((err) => {
        error(err);
      })
      .finally(() => {
        final();
      });
  },
  addNote: ({ id, content }, success, error, final) => {
    axios
      .post(`/calls/${id}/note`, { content })
      .then((res) => {
        success(res);
      })
      .catch((err) => {
        error(err);
      })
      .finally(() => {
        final();
      });
  },
};

export default CallServices;
