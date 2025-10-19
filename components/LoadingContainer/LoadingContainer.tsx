// Components import
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Styles import

type LoadingContainerProps = {
    isLoading?: boolean;
    children?: React.ReactNode;
};

/**
 * Function representing the loading container component.
 *
 * @returns LoadingContainer component
 */
export default function LoadingContainer(props: LoadingContainerProps) {
    const { isLoading = false, children } = props;

    return <>{isLoading ? <LoadingSpinner /> : children}</>;
}
