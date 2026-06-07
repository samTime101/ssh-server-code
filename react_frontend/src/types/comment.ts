export interface UserInfo {
  username: string;
  first_name: string;
  last_name: string;
}

export interface CommentNode {
  id: string;
  text: string;
  user_guid: string;
  user: UserInfo;
  parent_comment: string | null;
  created_at: string;
  updated_at: string;
  is_owner: boolean;
  replies: CommentNode[];
}

export interface CreateCommentPayload {
  question: string; // Question ID
  text: string;
  parent_comment?: string | null;
}