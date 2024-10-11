import React, { useCallback, useState, useRef, useEffect } from "react";
import { Box, Typography, Button, Grid, IconButton } from "@mui/joy";
//@ts-ignore
import { saveAs } from "file-saver";
import { ReflectionResult as ReflectionResultType } from "/imports/api/reflection/types";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";

interface ReflectionResultProps {
  result: ReflectionResultType;
}

export const ReflectionResult: React.FC<ReflectionResultProps> = ({
  result,
}) => {
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const audioSections = [
    { key: "quote", url: result.quoteAudio },
    { key: "reflection", url: result.reflectionAudio },
    { key: "story", url: result.storyAudio },
    { key: "application", url: result.applicationAudio },
    { key: "sharableCaption", url: result.sharableCaptionAudio },
  ];

  const handleDownload = useCallback(() => {
    if (result.image) {
      saveAs(result.image, `reflection-${new Date().toISOString()}.png`);
    }
  }, [result.image]);

  const playAudio = useCallback((section: string, autoplay: boolean = false) => {
    const audioUrl = audioSections.find(s => s.key === section)?.url;
    if (audioUrl) {
      if (playingAudio === section) {
        audioRef.current?.pause();
        setPlayingAudio(null);
        setIsAutoPlaying(false);
      } else {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        audioRef.current = new Audio(audioUrl);
        audioRef.current.play();
        setPlayingAudio(section);
        setIsAutoPlaying(autoplay);
      }
    }
  }, [playingAudio, audioSections]);

  const playNextAudio = useCallback(() => {
    if (isAutoPlaying) {
      const currentIndex = audioSections.findIndex(s => s.key === playingAudio);
      const nextIndex = currentIndex + 1;
      if (nextIndex < audioSections.length) {
        playAudio(audioSections[nextIndex].key, true);
      } else {
        setIsAutoPlaying(false);
        setPlayingAudio(null);
      }
    }
  }, [playingAudio, audioSections, isAutoPlaying, playAudio]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = playNextAudio;
    }
  }, [playingAudio, playNextAudio]);

  useEffect(() => {
    // Start autoplay with the first audio
    if (audioSections[0].url) {
      playAudio(audioSections[0].key, true);
    }

    // Cleanup function to stop audio when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
      }
    };
  }, []);

  const renderAudioButton = (section: string) => (
    <IconButton
      onClick={() => playAudio(section)}
      disabled={!audioSections.find(s => s.key === section)?.url}
      size="sm"
      sx={{ mr: 1 }}
    >
      {playingAudio === section ? (
        <PauseRoundedIcon sx={{ fontSize: 16 }} />
      ) : (
        <PlayArrowRoundedIcon sx={{ fontSize: 16 }} />
      )}
    </IconButton>
  );

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid sm={4} xs={12}>
          <img
            src={result.image || ""}
            style={{ width: "100%" }}
            alt="Reflection"
          />
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
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "0.5em" }}>
            <Typography level="h4">Your Reflection:</Typography>
            {renderAudioButton("reflection")}
          </Box>
          <Typography mb={"1em"} level="body-md">
            {result.reflection}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "0.5em" }}>
            <Typography level="h4">A Story:</Typography>
            {renderAudioButton("story")}
          </Box>
          <Typography mb={"1em"} level="body-md">
            {result.story}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "0.5em" }}>
            <Typography level="h4">Application:</Typography>
            {renderAudioButton("application")}
          </Box>
          <Typography mb={"1em"} level="body-md">
            {result.application}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "0.5em" }}>
            <Typography level="h4">Sharable Caption:</Typography>
            {renderAudioButton("sharableCaption")}
          </Box>
          <Typography mb={"1em"} level="body-md">
            {result.sharableCaption}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};