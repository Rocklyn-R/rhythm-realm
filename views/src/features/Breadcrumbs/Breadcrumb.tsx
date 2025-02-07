import { Link, useParams, useLocation } from "react-router-dom";
import { formatNameForDisplay } from "../../utilities/utilities";



export const Breadcrumbs = () => {
    const { categoryName, subcategoryName, productName, variantName } = useParams();
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean); // Splitting the path and filtering out empty strings
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('searchTerm');
    const isLastSegment = (segment: string) => {
        // Decode the segment for comparison
        const decodedLastSegment = decodeURIComponent(pathSegments[pathSegments.length - 1]);
        // Check if the decoded segment matches the last segment in the path
        return decodedLastSegment === segment;
    };
    const formattedVariant = variantName ? formatNameForDisplay(variantName) : undefined;
    const formattedProductName = productName ? formatNameForDisplay(productName) : undefined;
    
    return (
        <div className="flex m-4 self-start space-x-2 flex-wrap">
            {location.pathname !== "/" && (
                <>
                    <Link to="/" className="underline hover:no-underline">Home</Link>
                </>
            )}
            {isLastSegment("SearchResults") && searchTerm && (
                <>
                    <span>/</span>
                    <span>Search Results</span>
                </>
            )}
            {isLastSegment("WishList") && (
                <>
                    <span>/</span>
                    <span>Wish List</span>
                </>
            )}
            {isLastSegment("AccountSettings") && (
                <>
                    <span>/</span>
                    <span>Account Settings</span>
                </>
            )}
            {isLastSegment("Cart") ? (
                <>
                    <span>/</span>
                    <span>Shopping cart</span>
                </>
            ) : ""}
            {categoryName && (
                <>
                    <span>/</span>
                    {isLastSegment(categoryName) ? (
                        <span>{categoryName}</span>
                    ) : (
                        <Link to={`/${categoryName}`} className="underline hover:no-underline">
                            {categoryName}
                        </Link>
                    )}
                </>
            )}
            {subcategoryName && (
                <>
                    <span>/</span>
                    {isLastSegment(subcategoryName) ? (
                        <span>{subcategoryName}</span>
                    ) : (
                        <Link to={`/${categoryName}/${subcategoryName}`} className="whitespace-nowrap underline hover:no-underline">
                            {subcategoryName}
                        </Link>
                    )}
                </>
            )}
            {productName && !variantName && (
                <>
                    <span>/</span>
                    {isLastSegment(productName) ? (
                        <span>{formattedProductName}</span>
                    ) : (
                        <Link to={`/${categoryName}/${subcategoryName}/${productName}/${variantName}`} className="underline hover:no-underline">
                            {formattedProductName} {formattedVariant}
                        </Link>
                    )}
                </>
            )}
            {productName && variantName && (
                <>
                    <span>/</span>
                    {isLastSegment(variantName) ? (
                        <span>{formattedProductName} {formattedVariant}</span>
                    ) : (
                        <Link to={`/${categoryName}/${subcategoryName}/${productName}/${variantName}`} className="underline hover:no-underline">
                            {formattedProductName} {formattedVariant}
                        </Link>
                    )}
                </>
            )}
        </div>
    )
}