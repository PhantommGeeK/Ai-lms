"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import FlashcardItem from "./_components/FlashcardItem";
import { Layers } from "lucide-react";

const StyledSwiper = styled.div`
  .swiper {
    width: 100%;
    height: 50vh;
  }

  .swiper-slide {
    text-align: center;
    font-size: 18px;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .swiper {
    margin-left: auto;
    margin-right: auto;
  }

  .swiper-button-next,
  .swiper-button-prev {
    color: #a78bfa;
  }

  .swiper-pagination-bullet {
    background: #5d6380;
  }

  .swiper-pagination-bullet-active {
    background: #7c3aed;
  }
`;

function Flashcards() {
  const { courseId } = useParams();
  const [flashCards, setFlashCards] = useState([]);
  const [flippedStates, setFlippedStates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetFlashCards();
  }, []);

  const GetFlashCards = async () => {
    try {
      const result = await axios.post("/api/study-type", {
        courseId: courseId,
        studyType: "Flashcard",
      });
      setFlashCards(result.data);
    } catch (err) {
      console.error("Error fetching flashcards:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (index) => {
    setFlippedStates((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" />
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          <span className="ml-2 text-sm text-text-muted">Loading flashcards...</span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen p-5 animate-fade-in-up">
      <h2 className="text-2xl font-bold mb-2 text-center text-white flex items-center justify-center gap-2">
        <Layers className="w-6 h-6 text-purple-400" />
        Flashcards
      </h2>
      <p className="text-text-secondary text-sm text-center mb-8">Click a card to flip and reveal the answer</p>
      <div className="mt-12">
        <StyledSwiper>
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            loop={true}
            pagination={{ clickable: true }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            {flashCards?.content?.map((flashCard, index) => (
              <SwiperSlide key={index}>
                <FlashcardItem
                  isFlipped={flippedStates[index]}
                  handleClick={() => handleClick(index)}
                  flashCard={flashCard}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </StyledSwiper>
      </div>
    </div>
  );
}

export default Flashcards;
