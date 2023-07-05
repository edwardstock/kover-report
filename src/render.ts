import {
  ChangedFilesCoverage,
  ChangedFileWithCoverage,
  Coverage
} from './types.d'

export const createComment = (
  title: string | undefined,
  coverage: Coverage,
  changedFilesCoverage: ChangedFilesCoverage,
  minCoverageOverall: number | undefined,
  minCoverageChangedFiles: number | undefined
): string => {
  // Build title markdown
  const titleMarkdown = title ? `### ${title}\n` : ''

  // Build changed files markdown
  let changedFilesMarkdown = ''
  if (changedFilesCoverage.files.length > 0) {
    const filesTableRows = changedFilesCoverage.files
      .map(file => {
        return buildFileRow(file, minCoverageChangedFiles)
      })
      .join('\n')

    const header = buildHeader(changedFilesCoverage, minCoverageChangedFiles)

    changedFilesMarkdown = `${header}${filesTableRows}\n\n`
  }

  // Build total coverage markdown
  const totalEmoji = minCoverageOverall
    ? renderEmoji(coverage.percentage, minCoverageOverall)
    : ''
  const totalEmojiHeader = minCoverageOverall ? ':-:|' : ''
  const totalCoverageMarkdown = `|Total Project Coverage|${coverage.percentage.toFixed(
    2
  )}%|${totalEmoji}\n|:-|:-:|${totalEmojiHeader}`

  // Return combined markdown
  return `${titleMarkdown}${changedFilesMarkdown}${totalCoverageMarkdown}`
}

export const renderEmoji = (
  percentage: number,
  minPercentage: number
): string => (percentage >= minPercentage ? ':white_check_mark:|' : ':hankey:|')

function buildFileRow(
  file: ChangedFileWithCoverage,
  minCoverageChangedFiles: number | undefined
): string {
  const filePercentage = file.percentage.toFixed(2)
  const emoji = minCoverageChangedFiles
    ? renderEmoji(file.percentage, minCoverageChangedFiles)
    : ''
  const fileName = file.filePath.split('/').pop()
  return `|[${fileName}](${file.url})|${filePercentage}%|${emoji}`
}

function buildHeader(
  changedFilesCoverage: ChangedFilesCoverage,
  minCoverageChangedFiles: number | undefined
): string {
  let filesTableHeader: string
  let filesTableSubHeader: string

  const filesCoveredPercentage = changedFilesCoverage.percentage.toFixed(2)
  if (minCoverageChangedFiles) {
    filesTableHeader = `|File|Coverage [${filesCoveredPercentage}%]|Min. Covered|\n`
    filesTableSubHeader = `|:-|:-:|:-:|\n`
  } else {
    filesTableHeader = `|File|Coverage [${filesCoveredPercentage}%]|\n`
    filesTableSubHeader = `|:-|:-:|\n`
  }

  return `${filesTableHeader}${filesTableSubHeader}`
}
