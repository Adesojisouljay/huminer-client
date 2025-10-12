import React from "react";
import "./index.css";

export default function ChallengesPage() {
  const challenges = [
    {
      id: 1,
      title: "Best Freestyle Challenge",
      description: "Drop your hottest freestyle and win ₦5000!",
      reward: "₦5000",
      status: "live",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3bPXJtZ_mLobOdf0bcEcvfUD2aE5gYeyEcSaIgRJDO5VFcnTb7qf3eiSRWOHZnYi-xWc&usqp=CAU"
    },
    {
      id: 2,
      title: "Cover Song Contest",
      description: "Record a cover of your favorite song and stand a chance to be featured.",
      reward: "Feature on homepage",
      status: "ended",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwwd3RUiac8vo6jlYlMjTD5-BYvVedHaB4Vg&s"
    },
    {
      id: 3,
      title: "Beat Making Challenge",
      description: "Producers, create the best beat and win ₦10,000.",
      reward: "₦10,000",
      status: "live",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3bPXJtZ_mLobOdf0bcEcvfUD2aE5gYeyEcSaIgRJDO5VFcnTb7qf3eiSRWOHZnYi-xWc&usqp=CAU"
    },
    {
      id: 4,
      title: "Best Freestyle Challenge",
      description: "Drop your hottest freestyle and win ₦5000!",
      reward: "₦5000",
      status: "live",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3bPXJtZ_mLobOdf0bcEcvfUD2aE5gYeyEcSaIgRJDO5VFcnTb7qf3eiSRWOHZnYi-xWc&usqp=CAU"
    },
    {
      id: 5,
      title: "Cover Song Contest",
      description: "Record a cover of your favorite song and stand a chance to be featured.",
      reward: "Feature on homepage",
      status: "ended",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwwd3RUiac8vo6jlYlMjTD5-BYvVedHaB4Vg&s"
    },
    {
      id: 6,
      title: "Beat Making Challenge",
      description: "Producers, create the best beat and win ₦10,000.",
      reward: "₦10,000",
      status: "live",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3bPXJtZ_mLobOdf0bcEcvfUD2aE5gYeyEcSaIgRJDO5VFcnTb7qf3eiSRWOHZnYi-xWc&usqp=CAU"
    },
    {
      id: 7,
      title: "Best Freestyle Challenge",
      description: "Drop your hottest freestyle and win ₦5000!",
      reward: "₦5000",
      status: "live",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3bPXJtZ_mLobOdf0bcEcvfUD2aE5gYeyEcSaIgRJDO5VFcnTb7qf3eiSRWOHZnYi-xWc&usqp=CAU"
    },
    {
      id: 8,
      title: "Cover Song Contest",
      description: "Record a cover of your favorite song and stand a chance to be featured.",
      reward: "Feature on homepage",
      status: "ended",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwwd3RUiac8vo6jlYlMjTD5-BYvVedHaB4Vg&s"
    },
    {
      id: 9,
      title: "Beat Making Challenge",
      description: "Producers, create the best beat and win ₦10,000.",
      reward: "₦10,000",
      status: "live",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3bPXJtZ_mLobOdf0bcEcvfUD2aE5gYeyEcSaIgRJDO5VFcnTb7qf3eiSRWOHZnYi-xWc&usqp=CAU"
    }
  ];

  return (
    <div className="challenges-page">
      <h1>🔥 Music Challenges</h1>
      <p>Participate in exciting challenges, connect with fans, and win amazing rewards.</p>

      <div className="challenge-list">
        {challenges.map(challenge => (
          <div key={challenge.id} className="challenge-card card">
            <img src={challenge.image} alt={challenge.title} />

            <div className={`status-badge ${challenge.status}`}>
              {challenge.status === "live" ? "🟢 Ongoing" : "🔴 Ended"}
            </div>

            <h2>{challenge.title}</h2>
            <p>{challenge.description}</p>
            <span className="challenge-reward">Reward: {challenge.reward}</span>
            <button
              className="join-btn"
              disabled={challenge.status !== "live"}
            >
              {challenge.status === "live" ? "Join Challenge" : "Closed"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
