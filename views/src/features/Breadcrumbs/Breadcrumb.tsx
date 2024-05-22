import { Link } from "react-router-dom"
import { BreadcrumbPaths } from "../Subcategories/Subcategories"
import React from "react"

interface BreadcrumbsProps {
    paths: BreadcrumbPaths[]
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ paths }) => {
    return (
        <div className="flex m-4 self-start">
           {paths.map((path, index) => (
                <React.Fragment key={index}>
                    <Link className="underline" to={path.url}>
                        {path.name}
                    </Link>
                    {index < paths.length - 1 && <p className="mx-3">/</p>}
                </React.Fragment>
            ))}
        </div>
    )
}