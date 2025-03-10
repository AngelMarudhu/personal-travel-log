import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const useDebouncing = (actionCreator, delay = 500) => {
  const dispatch = useDispatch();
  const timeRef = useRef(null);

  const { updateLog } = useSelector((state) => state.userLog);

  const debounce = useCallback(
    (...args) => {
      if (timeRef.current) {
        clearTimeout(timeRef.current);
      }

      timeRef.current = setTimeout(() => {
        dispatch(actionCreator(...args));
        timeRef.current = null;
      }, delay);
    },
    [dispatch, actionCreator, delay, updateLog]
  );

  useEffect(() => {
    return () => {
      if (timeRef.current) {
        clearTimeout(timeRef.current);
      }
    };
  }, []);

  return debounce;
};

export default useDebouncing;
