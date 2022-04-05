# Contributing guidelines

Thanks for taking the time to contribute to VILLASweb, every help is appreciated!

> **Note:** This guidelines may seem much, but they just try to describe as good as possible to help with most common questions and problems. If you are unsure about anything feel free to **ask**.

#### Table of contents

[Quickstart](#quickstart)
  * [How to report a bug or request a feature](#report-a-bug-or-request-a-feature)
  * [Fix a bug](#fix-a-bug)

[Issues](#issues)
  * [Report bugs](#report-bugs)
  * [Request features](#request-features)
  * [Labels](#labels)
  
[Development](#development)
  * [Branches](#branches)
  * [Style guidelines](#style-guidelines)
    - [Code guidelines](#code-guidelines)
    - [Comment guidelines](#comment-guidelines)
    - [Git commit guidelines](#git-commit-guidelines)
  * [Merge requests](#merge-requests)
  * [Hotfix](#hotfix)

## Quickstart

### Report a bug or request a feature

Simply create a new issue in gitlab with an appropriate title and description. For more information see [report bugs](#report-bugs).

### Fix a bug

Look at the list of bugs in the issue list. Pick the bug you want to work on, create a new branch with gitlab on that issue and start working in that branch. For more information see [Development](#development).

## Issues

All issues are tracked by the gitlab issue tracker. Every issue created will be read!

### Report bugs

Every issue related to a bug must follow this rules:

  - Add the `bug` label.
  - Add the version, if known the exact commit.
  - If existing, add log messages.
  - If possible, add screenshots or animated GIFs of the bug.

### Request features

Every issue related to a feature or enhancement must follow this rules:

  - Add the `feature` or `enhancement` label.
  - If possible, mockup pictures or animated GIFs to help understand the request.

### Labels

There are two types of labels: `type` and `state`.

**Type labels** define what type the issue is about:
  - **Bug:** The issue is related to an existing bug in the system.

  - **Feature:** The issue is requesting a **new** feature.

  - **Enhancement:** The issue is requesting change or improving an **existing** feature.

  - **Question:** The issue is asking a question about the system.

  - **Invalid:** The issue was declared invalid by a project administrator.

  - **Duplicate:** The reason the issue was created is already in the system, thus the issue is marked duplicated by a project administrator.

  - **Help wanted:** This label is optional to request help by others.

**State labels** define in which state of development the issue is:
  - **Backlog:** The issue was accepted by the project administrators but has not been worked on.

  - **Development:** The issue is in active development.

  - **Testing:** The development of the issue is (mostly) finished and it is tested to make sure everything works.

  - **Doc-and-review:** The development of the issue is finished but the documentation is still missing and the project administrator want to review it before merging it into main code.

## Development

Before starting to develop you want to have completed the [setup](README.md#quick-start) steps.

### Branches

This are the type of branches you will/might see in this project:
  - **Master:** The *master* branch only contains **stable** release versions which must always be merged from the *develop* branch or *release-branches*. Each commit to this branch must contain a tag with at least the version.

  - **Develop:** The *develop* branch contains the current development version. Commits to this branch are prohibited (except [hotfixes](#hotfix)). See [merge requests](#merge-requests) on how to merge your working state into *develop*.

  - **Working branches:** *Working branches*, often also called *bug-fix/feature branches*, contain the active development state of features and bug-fixes. For each new feature or bug-fix you are working on, create a new *working branch*. To create new branch use gitlab's build-in feature to create a branch related to an issue.

  - **Legacy branches:** These branches must not be touched. The store legacy code from early development state.

  - **Release branches:** When preparing a *develop* version for release it is sometimes necessary to clean up before releasing it. Thus you first create a *release branch* of *develop*, do clean up on this branch and then release to *master*.

For more information on branches and git usage see [Git workflow tutorial](https://www.atlassian.com/git/tutorials/comparing-workflows#gitflow-workflow).

### Style guidelines

#### Code guidelines

  - Use **camelcase** by default for everything with respect to upper-camelcase (e.g. class names start with an upper case letter).

  - File names are all in lower case and hyphen separated (e.g. sample-file.js).

  - End files with an empty line.

  - Use [ES6](http://es6-features.org/) (ES2015) features especially `const`, arrow functions and ES6 classes.

  - Use *self-explaining names* for variables, methods and classes. **Don't** shorten names like `let ArrStr` instead of `class ArrayString`.

  - Don't use `var` unless it can't be avoided. For more information see [const](http://es6-features.org/#Constants) and [let](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/let).

  - Use [ES6 arrow functions](http://es6-features.org/#ExpressionBodies) for callbacks. If only one variable is used, **don't** bracket it.
    ```(javascript)
    const increased = arr.map(v => v + 1);
    const indexed = arr.map((v, index) => v += index);
    ```

  - Use [ES6 property shorthand](http://es6-features.org/#PropertyShorthand) whenever possible.
    ```(javascript)
    // Use
    const obj = { x, y };

    // Instead of
    const obj = { x: x, y: y };
    ```

  - Name *handler methods* `handleEventName` and *handler properties* `onEventName`.
    ```(javascript)
    <Component onClick={this.handleClick} />
    ```

  - Use autobind for event handlers and callbacks.
    ```(javascript)
    handleClick = e => {
      
    }
    ```
  
  - Don't import react component (or similar) itself. Use `React.Component`.
    ```(javascript)
    import React from 'react';

    class CustomComponent extends React.Component {

    }
    ```

  - Align and sort HTML properties properly.
    ```(HTML)
    // Do
    <Component className="component-class" width="100%" />
    <Component
      className="component-class"
      width="100%"
    />

    // Don't
    <Component className="component-class"
      width="100%"
    >
    <Component 
      className="component-class"
      width="100%" />
    ```

#### Comment guidelines

  - At the top of each file must be the following header:
    ```(javascript)
    /**
     * This file is part of VILLASweb.
     *
     * VILLASweb is free software: you can redistribute it and/or  modify
     * it under the terms of the GNU General Public License as published by
     * the Free Software Foundation, either version 3 of the License, or
     * (at your option) any later version.
     *
     * VILLASweb is distributed in the hope that it will be useful,
     * but WITHOUT ANY WARRANTY; without even the implied warranty of
     * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
     * GNU General Public License for more details.
     *
     * You should have received a copy of the GNU General Public License
     * along with VILLASweb. If not, see <http://www.gnu.org/licenses/>.
     ******************************************************************************/
    ```
  
  - By default use `//` for comments. You may use `/* */` for uncommenting a block of code.

  - Comment as many as neccessary, but don't comment obvious code which is obviously self-explaining.
    ```(javascript)
    // self-explaining, don't do this:
    // increase index
    index++;
    ```

#### Git commit guidelines

  - The first line should be a summary of the whole commit. The following lines should explain in detail what changed.
    ```
    Add dynamic rendering

    Add queue for dynamic renderer
    Change renderer to use queue for assets
    Add render priority to asset properties
    ```
  
  - Use present tense in comments (add, fix, update, remove etc.).

### Merge requests

When finished working on a bug-fix or feature in your branch, create a merge request to merge your code into the *develop* branch. Before creating the request, make sure your changes meet the following requirements:

  - The *code*, *documentation* and *git commits* follow all [style guidelines](#style-guidelines).

  - All CI (Continues integration) tests, if existing, must succeed.

  - Add screenshots and animated GIFs when appropriated to show changes.

  - If the *develop* branch has newer commits the *working branch* **may** be rebased to catch-up these commits.

### Hotfix

Sometimes it is neccessary to patch an important, security relevant or system breaking bug as fast as possible. In this case it is allowed to commit directly in *master/develop*, as long as this commit is only relevant for the bug fix. It **must** follow all rules for [merge requests](#merge-requests).
