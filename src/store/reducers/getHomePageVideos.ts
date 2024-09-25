import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "..";
import { HomePageVideos } from "../../Types";
import { parseData } from "../../utils";
import { YOUTUBE_API_URL } from "../../utils/constants";

const API_KEY = process.env.REACT_APP_YOUTUBE_DATA_API_KEY;

export const getHomePageVideos = createAsyncThunk(
  "youtubeApp/homePageVideos",
  async (isNext: boolean, { getState }) => {
    const {
      youtubeApp: { nextPageToken: nextPageTokenFromState, videos },
    } = getState() as RootState;

    try {
      const response = await axios.get(`${YOUTUBE_API_URL}/search`, {
        params: {
          maxResults: 20,
          q: "reactjs projects",
          key: API_KEY,
          part: "snippet",
          type: "video",
          ...(isNext && { pageToken: nextPageTokenFromState }),
        },
      });

      console.log("YouTube API response:", response.data);


      const { items, nextPageToken } = response.data;
      const parsedData: HomePageVideos[] = await parseData(items);

      return { parsedData: [...videos, ...parsedData], nextPageToken };
    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
      throw error;
    }
  }
);
