import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface Source {
  position: string;
  title?: string;
  url?: string;
  [key: string]: any;
}

interface SourcesComponentProps {
  item: any;
  onSourcePress?: (source: any) => void;
}

 const SourcesComponent: React.FC<SourcesComponentProps> = ({
  item,
  onSourcePress,
}) => {
  

  const renderSources = (item: any) => {
    if (item?.sources?.length > 1) {
      return (
        <View style={styles.containerRounded}>
          <Text style={styles.sourcesTitle}>{item?.sources?.length} Sources</Text>
        </View>
      );
    }else if(item?.sources?.length===1){
    return  <View style={styles.containerRounded}>
    <Text style={styles.sourcesTitle}>{item?.sources?.[0]?.title}</Text>
  </View>
  }else{
    return null;
  }
  };
   

  return <>{renderSources(item)}</>;
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  containerRounded: {
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical:8,
    borderRadius: 16,
    backgroundColor: "#cccccc",
    flexWrap:'wrap',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'flex-start',  
  },
  sourcesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    flexShrink:1,
  },
  sourcesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  sourceBadge: {
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  badgeContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  sourceText: {
    fontSize: 12,
    color: "#333",
    fontFamily: "Inter-Regular",
  },
});

export default SourcesComponent;

