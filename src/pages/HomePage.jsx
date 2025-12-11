import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { capitialize } from "../lib/utils";
import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  // --- Animations ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden text-gray-100 p-4 sm:p-6 lg:p-8">

      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">

        {/* SECTION: FRIENDS */}
        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                Your Friends
              </h2>
              <p className="text-gray-400 text-sm mt-1">People you are learning with</p>
            </div>

            <Link
              to="/notifications"
              className="group flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-white/10 hover:bg-gray-800 hover:border-primary/50 transition-all shadow-lg backdrop-blur-sm"
            >
              <UsersIcon className="size-4 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Friend Requests</span>
            </Link>
          </div>

          {loadingFriends ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : friends.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900/40 backdrop-blur-md rounded-2xl border border-white/5 p-8"
            >
              <NoFriendsFound />
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {friends.map((friend) => (
                <motion.div key={friend._id} variants={itemVariants}>
                  {/* Assuming FriendCard is styled, or needs wrapping. 
                      Since we can't edit FriendCard, we wrap it in a glass container if it doesn't have one */}
                  <FriendCard friend={friend} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent opacity-50" />

        {/* SECTION: RECOMMENDED USERS */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              Meet New Learners
              <Sparkles className="size-6 text-yellow-500 animate-pulse" />
            </h2>
            <p className="text-gray-400 mt-2 max-w-2xl">
              Discover perfect language exchange partners based on your profile and learning goals.
            </p>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg text-secondary" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="bg-gray-900/40 border border-white/10 rounded-2xl p-12 text-center">
              <h3 className="font-semibold text-xl mb-2 text-white">No recommendations available</h3>
              <p className="text-gray-400">Check back later for new language partners!</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <motion.div
                    key={user._id}
                    variants={itemVariants}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="group relative bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Card Content */}
                    <div className="p-6 flex flex-col h-full space-y-4">

                      {/* Header: Avatar & Name */}
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="avatar size-14 rounded-full ring-2 ring-white/10 p-0.5 bg-gray-800">
                            <img
                              src={user.profilePic || "/avatar.png"}
                              alt={user.fullName}
                              className="rounded-full object-cover w-full h-full"
                            />
                          </div>
                          {/* Online indicator dot (optional visual) */}
                          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                        </div>

                        <div>
                          <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-xs font-medium text-gray-500 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Language Badges */}
                      <div className="flex flex-wrap gap-2">
                        {/* Native */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-300">
                          <span>{getLanguageFlag(user.nativeLanguage)}</span>
                          <span>Native: <span className="text-white">{capitialize(user.nativeLanguage)}</span></span>
                        </div>

                        {/* Learning */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-300">
                          <span>{getLanguageFlag(user.learningLanguage)}</span>
                          <span>Learning: <span className="text-white">{capitialize(user.learningLanguage)}</span></span>
                        </div>
                      </div>

                      {/* Bio */}
                      <div className="flex-grow">
                        {user.bio ? (
                          <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                            {user.bio}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-600 italic">No bio available</p>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="pt-2">
                        <button
                          className={`w-full py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300
                            ${hasRequestBeenSent
                              ? "bg-gray-800 text-gray-400 cursor-not-allowed border border-white/5"
                              : "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98]"
                            }
                          `}
                          onClick={() => sendRequestMutation(user._id)}
                          disabled={hasRequestBeenSent || isPending}
                        >
                          {hasRequestBeenSent ? (
                            <>
                              <CheckCircleIcon className="size-4" />
                              <span>Request Sent</span>
                            </>
                          ) : (
                            <>
                              <UserPlusIcon className="size-4" />
                              <span>Connect</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;