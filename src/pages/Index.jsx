import React, { useState } from "react";
import { Box, Button, Heading, Input, Select, Text, VStack, Code, OrderedList, ListItem } from "@chakra-ui/react";

const Index = () => {
  const [jsonData, setJsonData] = useState(null);
  const [selectedProject, setSelectedProject] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = JSON.parse(e.target.result);
      setJsonData(data);
    };
    reader.readAsText(file);
  };

  const getProjectIds = () => {
    if (!jsonData) return [];
    const projectIds = new Set(Object.keys(jsonData.data).map((key) => key.split("/")[1]));
    return Array.from(projectIds);
  };

  const getProjectEdits = (projectId) => {
    if (!projectId || !jsonData) return [];

    const edits = Object.values(jsonData.data).filter((edit) => edit.id.startsWith(`projects/${projectId}/edits/`));

    return edits.sort((a, b) => new Date(b.created_at.__time__) - new Date(a.created_at.__time__));
  };

  const formatContent = (content) => {
    if (!content) return null;

    const lines = content.split("\n");
    const formattedLines = lines.map((line, index) => (
      <ListItem key={index}>
        {line.startsWith("```") ? (
          <Code p={2} mb={2}>
            {line.replace(/```/g, "")}
          </Code>
        ) : (
          <Text mb={2}>{line}</Text>
        )}
      </ListItem>
    ));

    return <OrderedList>{formattedLines}</OrderedList>;
  };

  return (
    <Box p={4}>
      <Heading as="h1" mb={4}>
        JSON Data Viewer
      </Heading>

      <VStack align="stretch" spacing={4}>
        <Input type="file" onChange={handleFileUpload} />

        {jsonData && (
          <Select placeholder="Select a project" value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
            {getProjectIds().map((projectId) => (
              <option key={projectId} value={projectId}>
                {projectId}
              </option>
            ))}
          </Select>
        )}

        {selectedProject && (
          <Box>
            <Heading as="h2" size="md" mb={2}>
              Edits for Project: {selectedProject}
            </Heading>
            {getProjectEdits(selectedProject).map((edit) => (
              <Box key={edit.id} mb={8}>
                <Text fontWeight="bold" mb={2}>
                  Edit ID: {edit.id.split("/")[3]}
                </Text>
                <Text mb={2}>Created At: {edit.created_at.__time__}</Text>
                {edit.content && edit.content.output && <Box mb={4}>{formatContent(edit.content.output)}</Box>}
              </Box>
            ))}
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default Index;
