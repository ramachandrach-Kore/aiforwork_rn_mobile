import { FC, useState } from "react";
import ResolveAmbiguityModal from "./ResolveAmbiguityModal";
import { Text, View } from "react-native";
import { useMessagesStore } from "../../aiforwork_sdk_core/store/messagesStore";
interface ResolveAmbiguityParentProps {
  data: any;
  onClose: () => void;
  onConfirmCallback: (data: any) => void;
  isLastItem: boolean;
}

const ResolveAmbiguityParent: FC<ResolveAmbiguityParentProps> = ({
  data,
  onClose,
  onConfirmCallback,
  isLastItem,
}) => {
  const { sendMessage } = useMessagesStore();

  const [isModalVisible, setIsModalVisible] = useState(isLastItem);

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    }
    setIsModalVisible(false);
  };

  const handleConfirModal = (data: any) => {
    sendMessage(data);
    setIsModalVisible(false);
  };

  if (isLastItem) {
    return (
      <View>
        <ResolveAmbiguityModal
          visible={isModalVisible}
          data={data}
          onClose={handleCloseModal}
          onConfirmCallback={handleConfirModal}
        />
      </View>
    );
  }
  return <> </>;
};

export default ResolveAmbiguityParent;
