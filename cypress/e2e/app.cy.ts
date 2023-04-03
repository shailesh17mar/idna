describe("Autocomplete", () => {
  beforeEach(() => {
    cy.intercept("GET", "https://api.github.com/search/*", (req) => {
      const url = new URL(req.url);
      const searchParams = new URLSearchParams(url.search);
      const query = searchParams.get("q");
      if (query === "react") {
        req.reply({
          statusCode: 200,
          body: {
            items: [
              {
                id: 1,
                name: "react",
                html_url: "https://github.com/facebook/react",
              },
              {
                id: 2,
                name: "react-router",
                html_url: "https://github.com/ReactTraining/react-router",
              },
            ],
            total_count: 2,
          },
        });
      } else if (query === "loading") {
        req.reply({
          statusCode: 200,
          body: {
            items: [],
            total_count: 0,
          },
          delay: 1000,
        });
      } else if (query === "empty") {
        req.reply({
          statusCode: 200,
          body: {
            items: [],
            total_count: 0,
          },
        });
      } else if (query === "forbidden") {
        req.reply({
          statusCode: 500,
          body: {
            message: "API rate limit exceeded.",
          },
        });
      }
    });
    cy.visit("/");
  });

  it("should display a loading message when the request takes too long", () => {
    cy.get('[data-testid="autocomplete-input"]').type("loading");
    cy.get('[data-testid="autocomplete-state-info"]').contains("Loading...");
    cy.get('[data-testid="result-item"]').should("not.exist");
  });

  it("should display a message when there are no results", () => {
    cy.get('[data-testid="autocomplete-input"]').type("empty");
    cy.get('[data-testid="result-item"]').should("not.exist");
    cy.get('[data-testid="autocomplete-state-info"]').contains(
      "We couldn't find any repositories matching 'empty'"
    );
  });

  it("should display an error message when the API returns an error", () => {
    cy.get('[data-testid="autocomplete-input"]').type("forbidden");
    cy.get('[data-testid="result-item"]').should("not.exist");
    cy.get('[data-testid="autocomplete-state-error"]').contains(
      "Try again in sometime or contact support."
    );
  });
});

export {};
