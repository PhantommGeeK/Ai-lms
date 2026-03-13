import axios from "axios";
import React, { useEffect, useState } from "react";
import { Play, Video } from "lucide-react";

function VideoRecommendations({ topic }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (topic) {
      fetchVideos();
    }
  }, [topic]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const query = `${topic} tutorial`;
      const result = await axios.get(`/api/youtube?query=${encodeURIComponent(query)}`);
      if (result.data?.videos) {
        setVideos(result.data.videos);
      }
    } catch (err) {
      console.error("Error fetching recommended videos:", err);
      setError("Failed to load recommended videos.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Video className="w-5 h-5 text-purple-400" />
          Recommended Videos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((item) => (
            <div key={item} className="glass-card-static overflow-hidden">
              <div className="h-[180px] w-full skeleton" />
              <div className="p-3">
                <div className="skeleton h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || videos.length === 0) {
    return null;
  }

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
        <Video className="w-5 h-5 text-purple-400" />
        Recommended Videos
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map((video, index) => (
          <div key={index} className="glow-card overflow-hidden group">
            <div className="relative">
              <iframe
                width="100%"
                height="180"
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full"
              />
            </div>
            <div className="p-3">
              <h3 className="text-xs font-semibold text-text-primary line-clamp-2 group-hover:text-purple-400 transition-colors">
                {video.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VideoRecommendations;
