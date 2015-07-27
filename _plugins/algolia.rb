# Overwrite Algolia Jekyll plugin with custom hooks
class AlgoliaSearchRecordExtractor
  # Custom hook to add more information to each element
  def custom_hook_each(item, node)
    # Skip <p class="post-info">
    return nil if node.matches?('p.post-info')

    # Add the real author name
    if item[:full_author].respond_to?(:name)
      item[:author] = item[:full_author].name
      item.delete :full_author
    end

    item
  end
end

# Overwrite Algolia Jekyll plugin with custom hooks
class AlgoliaSearchJekyllPush < Jekyll::Command
  class << self
    def custom_hook_excluded_file?(file)
      # Skip pages that are only index of posts
      return true if file.path =~ %r{^(authors|company|engineering|tags)/}
      false
    end
  end
end
