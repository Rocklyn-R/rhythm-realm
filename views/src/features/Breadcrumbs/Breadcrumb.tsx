import { Link, useParams, useLocation } from "react-router-dom";



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

    return (
        <div className="flex m-4 self-start space-x-2">
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
                        <span>{productName}</span>
                    ) : (
                        <Link to={`/${categoryName}/${subcategoryName}/${productName}/${variantName}`} className="underline hover:no-underline">
                            {productName} {variantName}
                        </Link>
                    )}
                </>
            )}
            {productName && variantName && (
                <>
                    <span>/</span>
                    {isLastSegment(variantName) ? (
                        <span>{productName} {variantName}</span>
                    ) : (
                        <Link to={`/${categoryName}/${subcategoryName}/${productName}/${variantName}`} className="underline hover:no-underline">
                            {productName} {variantName}
                        </Link>
                    )}
                </>
            )}
        </div>
    )
}