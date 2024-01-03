type PromptSuggestionProps = {
    suggestion: string;
    onClick: () => void;
    isLoading?: boolean;
  };
  
  export const PromptSuggestion: React.FC<PromptSuggestionProps> = ({
    suggestion,
    onClick,
    isLoading = false,
  }) => {
    return (
      <button
        onClick={() => onClick()}
        disabled={isLoading}
        className={`border p-2 rounded-2xl ${
          !isLoading ? 'cursor-pointer' : 'cursor-not-allowed'
        } hover:bg-gray-100 transition`}
      >
        {suggestion}
      </button>
    );
  };
  