import type { DemoUser } from "./demoUsers";
import { supabase } from "./supabase";

export type ParticipantReviewInput = {
  age?: number;
  avatarUrl?: string;
  confirmed: boolean;
  customVibe: string;
  name: string;
  seedUserId?: number;
  selectedVibes: string[];
  wantsToMeetAgain: boolean;
};

export type PlanFeedbackInput = {
  overallLabel: string;
  overallRating: number;
  participantReviews: ParticipantReviewInput[];
  planId: string;
  planTitle?: string;
};

async function getCurrentUserId() {
  if (!supabase) return null;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user.id;
}

export async function savePlanFeedback(input: PlanFeedbackInput) {
  const userId = await getCurrentUserId();
  if (!supabase || !userId) return null;

  const { data, error } = await supabase
    .from("plan_feedback")
    .upsert(
      {
        overall_label: input.overallLabel,
        overall_rating: input.overallRating,
        plan_id: input.planId,
        plan_title: input.planTitle ?? null,
        user_id: userId,
      },
      {
        onConflict: "user_id,plan_id",
      },
    )
    .select("id")
    .single();

  if (error || !data?.id) return null;

  await supabase.from("plan_feedback_reviews").delete().eq("feedback_id", data.id);

  const rows = input.participantReviews.map((review, index) => ({
    confirmed: review.confirmed,
    custom_vibe: review.customVibe.trim() || null,
    feedback_id: data.id,
    participant_age: review.age ?? null,
    participant_avatar_url: review.avatarUrl ?? null,
    participant_name: review.name,
    participant_seed_user_id: review.seedUserId ?? null,
    selected_vibes: review.selectedVibes,
    sort_order: index,
    wants_to_meet_again: review.wantsToMeetAgain,
  }));

  if (rows.length > 0) {
    const { error: reviewsError } = await supabase
      .from("plan_feedback_reviews")
      .insert(rows);

    if (reviewsError) return data.id;
  }

  return data.id;
}

export function buildParticipantReviews(
  participants: DemoUser[],
  reviews: Record<
    string,
    {
      confirmed: boolean;
      customVibe: string;
      selectedVibes: string[];
    }
  >,
  selectedUsers: string[] = [],
): ParticipantReviewInput[] {
  return participants.map((participant) => {
    const review = reviews[participant.name] ?? {
      confirmed: false,
      customVibe: "",
      selectedVibes: [],
    };

    return {
      age: participant.age,
      avatarUrl: participant.avatarUrl,
      confirmed: review.confirmed,
      customVibe: review.customVibe,
      name: participant.name,
      seedUserId: participant.seedUserId,
      selectedVibes: review.selectedVibes,
      wantsToMeetAgain: selectedUsers.includes(participant.name),
    };
  });
}
