import React, { useCallback } from "react";
import { Box, Typography, Button, Grid } from "@mui/joy";
//@ts-ignore
import { saveAs } from "file-saver";
import { ReflectionResult as ReflectionResultType } from "/imports/api/Reflection";

interface ReflectionResultProps {
  result: ReflectionResultType;
}

export const ReflectionResult: React.FC<ReflectionResultProps> = ({ result }) => {
  const handleDownload = useCallback(() => {
    if (result.image) {
      saveAs(result.image, `reflection-${new Date().toISOString()}.png`);
    }
  }, [result.image]);

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid sm={4} xs={12}>
          <img src={result.image || ''} style={{ width: "100%" }} alt="Reflection" />
          <Typography mb={"1.5em"} level="body-md">
            {result.quote}
          </Typography>
          <Box sx={{ width: "100%" }}>
            <Grid container spacing={2}>
              <Grid xs={6}>
                <Button
                  fullWidth
                  variant="solid"
                  color="primary"
                  size="md"
                  onClick={handleDownload}
                  disabled={!result.image}
                >
                  Download Image
                </Button>
              </Grid>
              <Grid xs={6}>
                <Button
                  disabled
                  fullWidth
                  variant="outlined"
                  color="primary"
                  size="md"
                >
                  Join Act I
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid sm={8} xs={12}>
          <Typography mb={"0.5em"} level="h4">
            Your Reflection:
          </Typography>
          <Typography mb={"1em"} level="body-md">
            {result.reflection}
          </Typography>
          <Typography mb={"0.5em"} level="h4">
            A Story:
          </Typography>
          <Typography mb={"1em"} level="body-md">
            {result.story}
          </Typography>
          <Typography mb={"0.5em"} level="h4">
            Application:
          </Typography>
          <Typography mb={"1em"} level="body-md">
            {result.application}
          </Typography>
          <Typography mb={"0.5em"} level="h4">
            Sharable Caption:
          </Typography>
          <Typography mb={"1em"} level="body-md">
            {result.sharableCaption}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};