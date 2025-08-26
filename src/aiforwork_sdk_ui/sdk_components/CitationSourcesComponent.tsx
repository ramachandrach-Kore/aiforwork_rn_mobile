import React, { useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { markdownStyles } from "./MarkDownStyles";
import CustomAlert from "./CustomAlert";
import CitationOpenView from "./CitationOpenView";

interface CitationSource {
  position: string | number;
  [key: string]: any;
}

interface CitationSourcesComponentProps {
  sources: CitationSource[];

  item?: any;
}
interface SelectedSource {
  item: any;
  citation: any;
}

const CitationSourcesComponent = ({
  sources,
  item,
}: CitationSourcesComponentProps): JSX.Element | null => {
  const [citationPopupVisible, setAlertVisible] = useState(false);
  const [selectedSource, setSelectedSource] = useState<SelectedSource | null>(
    null
  );
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      {sources.map((source: CitationSource, index: number) => (
        <TouchableOpacity
          key={`${source?.position}-${index}`}
          style={markdownStyles.badge}
          hitSlop={16}
          onPress={() => {
            setSelectedSource({ item, citation: source });
            setAlertVisible(true);
            console.log("State updated - popup should be visible");
          }}
        >
          <View style={markdownStyles.badgeBase}>
            <Text style={markdownStyles.text1}>{source?.position}</Text>
          </View>
        </TouchableOpacity>
      ))}
      <CustomAlert
        visible={citationPopupVisible}
        onClose={() => setAlertVisible(false)}
      >
        <CitationOpenView selectedSource={selectedSource} />
      </CustomAlert>
    </View>
  );
};

export default CitationSourcesComponent;
