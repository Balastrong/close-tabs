import { Change, Repository } from "../git";

export function hasDiff(fileName: string, repository: Repository) {
  return repository.state.workingTreeChanges.some((change: Change) => {
    return change.uri.fsPath === fileName;
  });
}
