### Proposal selection procedure

weighted round-robin for selecting proposers

peers can dial for the current state of the proposer pool

this should be as light-weight and fast as possible as to not impose a overly-large toll on
the system at large

#### Requirements

###### R1: Determinism

Given a validator set V, and two honest validators p and q, for each height h and each round r the following must hold:

proposer_p(h,r) = proposer_q(h,r)

where proposer_p(h,r) is the proposer returned by the Proposer Selection Procedure at process p, at height h and round r.

###### R2: Fairness

Given a validator set with total voting power P and a sequence S of elections. In any sub-sequence of S with length C\*P, a validator v must be elected as proposer P/VP(v) times, i.e. with frequency:

f(v) ~ VP(v) / P

where C is a tolerance factor for validator set changes with following values:

C == 1 if there are no validator set changes
C ~ k when there are validator changes

#### Basic Algorithm

At its core, the proposer selection procedure uses a weighted round-robin algorithm.

A model that gives a good intuition on how/ why the selection algorithm works and it is fair is that of a priority queue. The validators move ahead in this queue according to their voting power (the higher the voting power the faster a validator moves towards the head of the queue). When the algorithm runs the following happens:

all validators move "ahead" according to their powers: for each validator, increase the priority by the voting power
first in the queue becomes the proposer: select the validator with highest priority
move the proposer back in the queue: decrease the proposer's priority by the total voting power
