// since limit is set to 10, checking if the new batch of posts is equal to it's limit which would indicate that there are possibly more posts to fetch, then incrementing cursor (offset) by 10
export default function getInfiniteQueryCursor({
  postsLength,
  cursor,
}: {
  postsLength: number;
  cursor: number | undefined | null;
}) {
  if (postsLength !== 10) return null;

  return cursor! + 10;
}
