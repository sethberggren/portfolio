import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom'

import Header from "./Header";

describe("Header unit tests", () => {

    it("should render the iceberggren with the iceberg logo", () => {
        const {getByText} = render(<Header />);

        expect(getByText(/iceberggren/i)).toBeInTheDocument();
    })
})