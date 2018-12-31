<?php
namespace Thucke\ThRating\View;
/***************************************************************
 *  Copyright notice
 *
 *  (c) 2013 Thomas Hucke <thucke@web.de>
 *  All rights reserved
 *
 *  This script is part of the TYPO3 project. The TYPO3 project is
 *  free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  The GNU General Public License can be found at
 *  http://www.gnu.org/copyleft/gpl.html.
 *
 *  This script is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  This copyright notice MUST APPEAR in all copies of the script!
 ***************************************************************/

/**
 * The Rating Viewhelper
 *
 * @version $Id:$
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License, version 2
 */
class JsonView extends \TYPO3\CMS\Extbase\Mvc\View\JsonView {

	/**
	 * Tag builder instance
	 *
	 * @var \TYPO3\CMS\Fluid\Core\ViewHelper\TagBuilder
	 * @inject
	 */
	protected $tag = NULL;

	/**
	 * Only variables whose name is contained in this array will be rendered
	 *
	 * @var array
	 */
	protected $variablesToRender = [
		'actionMethodName',
		'currentPollDimensions',
		'ratingClass',
		'preContent',
		'postContent',
		'ajaxRef',
		'rating',
		'voter',
		//'ratingobject',
		//'currentRates',
		//'anonymousVotes',
		'stepCount',
		'anonymousVoting',
		'protected',
		'voting',
		'usersRate',
		'ratingobjects',
		//'LANG',
		'flashMessages',];
	/**/

	/**
	 * Initializes this view.
	 *
	 * Override this method for initializing your concrete view implementation.
	 *
	 * @return void
	 * @api
	 */
	public function initializeView() {
		$configuration = [
			'voter' => [
				'_exclude' => ['pid','uid'],],
			'rating' => [
				'_exclude' => ['pid','uid'],
				'_descend' => [
					'currentrates' => [],
					'ratingobject' => [
						'_exclude' => ['pid','uid'],],],],
			'voting' => [
				'_exclude' => ['pid','uid'],
				'_descend' => [
					'vote' => [
						'_exclude' => ['pid','uid'],
						'_descend' => [
							'stepname' => [
								'_exclude' => ['pid','uid'],],],],],],];
		$this->setConfiguration($configuration);
	}

	/**
	 * Get the classic DIV rendered FlashMessages from queue
	 *
	 * @return string
	 */
	public function getFlashMessages() {
		$this->tag = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance('TYPO3\\CMS\\Extbase\\Object\\ObjectManager')->get('TYPO3\\CMS\\Fluid\\Core\\ViewHelper\\TagBuilder');
		return $this->renderAsDiv($this->controllerContext->getFlashMessageQueue()->getAllMessagesAndFlush());
	}

	/**
	 * Renders the flash messages in DIV mode like in TYPO3 6.2
	 *
	 * @param array $flashMessages \TYPO3\CMS\Core\Messaging\FlashMessage[]
	 * @return string
	 */
	protected function renderAsDiv(array $flashMessages) {
		$markup = [];
		foreach ($flashMessages as $flashMessage) {
			$markup[] = '<div class="alert ' . htmlspecialchars($flashMessage->getClass()). '">';
			$messageTitle = $flashMessage->getTitle();
			if ($messageTitle !== '') {
				$markup[] = '<h4 class="alert-title">' . htmlspecialchars($messageTitle) . '</h4>';
			}
			$markup[] = '<div class="alert-message">' . htmlspecialchars($flashMessage->getMessage()) . '</div>';
			$markup[] = '</div>';
		}
		return trim(implode('', $markup));
	}
}
