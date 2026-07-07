> **Archived (2026-07-06): v1 prototype spec.** Onboarding flow for the contributor-mining model (users assigned a property to research and submit). The current plan treats contributor mining as speculative and defers it ([plan-v2.md](../plan-v2.md), Phase 4) — the near-term supply side is automation plus professional abstractors.

# PRD: First-Time User Experience (App Frontend)

**Version:** 1.0
**Date:** {{Current Date}}
**Author:** {{Author Name}}

## 1. Introduction

This document outlines the requirements for the initial experience of users opening the application frontend for the first time. The goal is to onboard users smoothly, explain the core purpose of the application, guide them through necessary setup steps (like wallet connection), and provide clear instructions on how to participate or contribute.

## 2. Goals

*   Provide a clear and concise introduction to the application's purpose and value proposition.
*   Guide users through the essential setup steps required for participation.
*   Explain the contribution process clearly.
*   Reduce friction for new users, encouraging engagement and contribution.
*   Ensure users understand where to find required data and how to submit it.

## 3. Target Audience

*   New users interacting with the application frontend for the first time.
*   Users unfamiliar with blockchain concepts or the specific wallet required.

## 4. User Stories

*   **As a new user,** I want to understand what the application does so I can decide if I want to participate.
*   **As a new user,** I want clear instructions on how to set up or connect my **wallet address** so I can interact with the application.
*   **As a new user,** I want to know how I can contribute or participate in the application's core function.
*   **As a new user,** I want to be given a **property address** so I know which property to look up data for.
*   **As a new user,** I want to know exactly where to find the county records data for the provided property address.
*   **As a new user,** I want clear steps on how to submit the property data I found.

## 5. Requirements

### 5.1. Welcome & Introduction

*   **REQ-FTE-001:** Upon first launch (or until dismissed/completed), display a welcome modal or dedicated onboarding flow.
*   **REQ-FTE-002:** The onboarding flow must briefly explain the application's purpose and the value of contributing.
*   **REQ-FTE-003:** Include visually appealing elements and concise text.

### 5.2. Wallet Setup/Connection

*   **REQ-FTE-004:** Guide the user to connect an existing compatible wallet or provide instructions/links for setting up a new one.
*   **REQ-FTE-005:** Clearly list supported wallet types.
*   **REQ-FTE-006:** Provide feedback on successful wallet connection.
*   **REQ-FTE-007:** Handle potential errors during connection gracefully (e.g., user rejects connection, wrong network).

### 5.3. Contribution Explanation & Guidance

*   **REQ-FTE-008:** Explain the contribution process step-by-step: finding county record data for a given property and submitting it.
*   **REQ-FTE-009:** Provide the user with a **property address** required for their contribution task. Clearly explain that this address is for looking up information in county records.
*   **REQ-FTE-010:** Provide clear instructions on *where* the user can find the specific county record data for the provided property address (e.g., link to county record website, specific database/section to search).
*   **REQ-FTE-011:** Provide clear instructions on *how* to submit the found property data for validation (e.g., "Enter the data points X, Y, Z in the form and click Submit").

### 5.4. User Interface & Experience

*   **REQ-FTE-012:** The onboarding flow should be dismissible or skippable, allowing experienced users to bypass it.
*   **REQ-FTE-013:** Progress indicators should be used if the onboarding is multi-step.
*   **REQ-FTE-014:** The design should be consistent with the overall application theme.

## 6. Out of Scope

*   Detailed tutorials on general blockchain/wallet usage (links to external resources are acceptable).
*   Advanced user features or settings.

## 7. Open Questions

*   What specific wallet(s) must be supported for the user's **wallet address**?
*   How are **property addresses** assigned or selected for users? (e.g., queue, random assignment, user selection?)
*   What specific data points from county records do users need to find and submit?
*   What is the exact mechanism for data submission? (Form, API call, smart contract interaction?)
*   Where exactly are the county records located? (Specific URLs, databases?)
*   Should the onboarding be presented again if the user clears cache/storage?
