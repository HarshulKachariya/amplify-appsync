import { Box, Skeleton } from "@mui/material";

const Loader = ({ length }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
      {Array.from({ length: length }).map((_, index) => (
        <Box key={index} sx={{ width: 300, padding: 1 }}>
          <Skeleton variant="rectangular" width={210} height={118} />
          <Skeleton />
          <Skeleton width="60%" />
        </Box>
      ))}
    </div>
  );
};

export default Loader;
