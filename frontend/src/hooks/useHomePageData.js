import { useState, useEffect } from "react";
import { api } from "../services/api";

let cachedData = null;
let fetchPromise = null;

const useHomePageData = () => {
  const [data, setData] = useState(cachedData);
  const [loading, setLoading] = useState(!cachedData);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cachedData) {
      setData(cachedData);
      setLoading(false);
      return;
    }

    if (!fetchPromise) {
      fetchPromise = api.getHomePage().then(
        (res) => {
          cachedData = res;
          return res;
        }
      );
    }

    fetchPromise
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        fetchPromise = null; // reset so we can try again
      });
  }, []);

  return { data, loading, error };
};

export default useHomePageData;
