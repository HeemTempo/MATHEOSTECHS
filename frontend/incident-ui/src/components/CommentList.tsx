import { Avatar, AvatarFallback } from './ui/avatar';
import { getInitials, formatRelativeTime } from '../utils/helpers';
import type { Comment } from '../api/incidents';

interface CommentListProps {
  comments: Comment[];
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <Avatar className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20">
            <AvatarFallback className="text-indigo-400 text-sm">
              {getInitials(comment.user.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-white">{comment.user.name}</span>
              <span className="text-sm text-slate-500">
                {formatRelativeTime(comment.created_at)}
              </span>
            </div>
            <p className="text-slate-300">{comment.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
